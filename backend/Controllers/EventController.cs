using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventRepository _eventRepo;
    private readonly IUserRepository _userRepo;
    private readonly IRegistrationRepository _registrationRepo;

    public EventController(IEventRepository repo, IUserRepository userRepo, IRegistrationRepository regis)
    {
        _eventRepo = repo;
        _userRepo = userRepo;
        _registrationRepo = regis;
    }

    private async Task<object> MergeEventWithUserAsync(Event ev)
    {
        var user = await _userRepo.GetById(ev.UserID);
        return new
        {
            ev.EventID,
            ev.EventTitle,
            ev.EventDescription,
            ev.EventLocation,
            ev.EventDateTime,
            ev.CreatedAt,
            User = user
        };
    }

    // ✅ Get All Events
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var events = await _eventRepo.GetAll();
            var mergedEvents = new List<object>();

            foreach (var ev in events)
                mergedEvents.Add(await MergeEventWithUserAsync(ev));

            return Ok(new
            {
                status = 200,
                success = true,
                message = "All events fetched successfully",
                data = mergedEvents
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching events.",
                error = ex.Message
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEventById(int id)
    {
        try
        {
            var evt = await _eventRepo.GetEventByIdAsync(id);
            if (evt == null)
                return NotFound(new
                {
                    status = 404,
                    success = false,
                    message = "Event not found"
                });

            var mergedEvent = await MergeEventWithUserAsync(evt);

            return Ok(new
            {
                status = 200,
                success = true,
                message = "Event fetched successfully",
                data = mergedEvent
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching the event.",
                error = ex.Message
            });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Event ev)
    {
        try
        {
            ev.CreatedAt = DateTime.UtcNow;
            await _eventRepo.Add(ev);

            var mergedEvent = await MergeEventWithUserAsync(ev);

            return Ok(new
            {
                status = 200,
                success = true,
                message = "Event created successfully",
                data = mergedEvent
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while creating the event.",
                error = ex.Message
            });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Event ev)
    {
        try
        {
            if (id != ev.EventID)
            {
                return BadRequest(new
                {
                    status = 400,
                    success = false,
                    message = "Event ID mismatch"
                });
            }

            var existing = await _eventRepo.GetEventByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new
                {
                    status = 404,
                    success = false,
                    message = "Event not found"
                });
            }

            existing.EventTitle = ev.EventTitle;
            existing.EventDescription = ev.EventDescription;
            existing.EventLocation = ev.EventLocation;
            existing.EventDateTime = ev.EventDateTime;
            existing.UserID = ev.UserID;

            await _eventRepo.Update(existing);

            var mergedEvent = await MergeEventWithUserAsync(existing);

            return Ok(new
            {
                status = 200,
                success = true,
                message = "Event updated successfully",
                data = mergedEvent
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while updating the event.",
                error = ex.Message
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var existing = await _eventRepo.GetEventByIdAsync(id);
            if (existing == null)
                return NotFound(new
                {
                    status = 404,
                    success = false,
                    message = "Event not found"
                });

            await _eventRepo.DeleteEventWithRegistrationsAsync(id);

            return Ok(new
            {
                status = 200,
                success = true,
                message = "Event and its registrations deleted successfully"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while deleting the event.",
                error = ex.Message
            });
        }
    }

    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetEventsByUserId(int id)
    {
        try
        {
            var userEvents = await _eventRepo.GetEventsByUserIdAsync(id);
            var mergedEvents = new List<object>();

            foreach (var ev in userEvents)
                mergedEvents.Add(await MergeEventWithUserAsync(ev));

            return Ok(new
            {
                status = 200,
                success = true,
                message = mergedEvents.Count > 0
                    ? "Events fetched successfully"
                    : "No events found for the given user.",
                data = mergedEvents
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching events by user ID.",
                error = ex.Message
            });
        }
    }

    [HttpGet("participants/count/{userId}")]
    public async Task<IActionResult> GetTotalCount(int userId)
    {
        try
        {
            var userEvents = await _eventRepo.GetEventsByUserIdAsync(userId);
            var eventIds = userEvents.Select(e => e.EventID).ToList();

            int totalCount = 0;

            foreach (var e in eventIds)
            {
                var temp = await _registrationRepo.GetByEventId(e);
                totalCount += temp.Count;
            }

            return Ok(new
                {
                    status = 200,
                    success = true,
                    message = "Total participants.",
                    totalParticipants = totalCount
                });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching total participants count.",
                error = ex.Message
            });
        }
    }


    [HttpGet("participants/{eventId}/{userId}")]
    public async Task<IActionResult> GetTotalParticipantsForUserEvents(int eventId, int userId)
    {
        try
        {
            var regis = await _registrationRepo.GetByEventId(eventId);
            var users = new List<object>();

            if (regis == null || !regis.Any())
            {
                return Ok(new
                {
                    status = 200,
                    success = true,
                    message = "No participants found.",
                    totalParticipants = 0,
                    users = new List<object>()
                });
            }

            var userIds = regis.Select(e => e.UserID).ToList();

            foreach (var id in userIds)
            {
                var temp = await _userRepo.GetById(id);
                if (temp != null)
                {
                    users.Add(new
                    {
                        temp.UserID,
                        temp.UserFullName,
                        temp.UserEmail,
                        temp.UserMobile,
                        temp.UserRole
                    });
                }
            }

            return Ok(new
            {
                status = 200,
                success = true,
                message = "Total participants count fetched successfully",
                totalParticipants = users.Count,
                users
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching total participants count.",
                error = ex.Message
            });
        }
    }
}