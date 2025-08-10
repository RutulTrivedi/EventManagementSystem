using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class RegistrationController : ControllerBase
{
    private readonly IRegistrationRepository _repo;
    private readonly IEventRepository _eventRepo;

    public RegistrationController(IRegistrationRepository repo, IEventRepository eventRepo)
    {
        _repo = repo;
        _eventRepo = eventRepo;
    }

    public async Task<IActionResult> GetAll()
    {
        try
        {
            var registrations = await _repo.GetAll();
            var mergedRegs = new List<object>();

            // Attach full event data
            foreach (var reg in registrations)
            {
                mergedRegs.Add(new
                {
                    registerID = reg.RegisterID,
                    eventID = reg.EventID,
                    userID = reg.UserID,
                    eventData = await _eventRepo.GetEventByIdAsync(reg.EventID)
                });
            }

            return Ok(new
            {
                status = 200,
                success = true,
                message = "All registrations fetched successfully",
                data = mergedRegs
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching registrations.",
                error = ex.Message
            });
        }
    }


    // ✅ Register user to an event
    [HttpPost]
    public async Task<IActionResult> Register([FromBody] Registration reg)
    {
        try
        {
            reg.CreatedAt = DateTime.UtcNow;
            await _repo.Register(reg);

            var ev = await _eventRepo.GetEventByIdAsync(reg.EventID);

            return Ok(new
            {
                status = 200,
                success = true,
                message = "User registered for event successfully",
                data = new
                {
                    reg.RegisterID,
                    reg.EventID,
                    reg.UserID,
                    reg.CreatedAt,
                    Event = ev
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred during registration",
                error = ex.Message
            });
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(int userId)
    {
        try
        {
            var registrations = await _repo.GetByUserId(userId);
            var mergedRegs = new List<object>();

            foreach (var reg in registrations)
            {
                mergedRegs.Add(new
                {
                    registerID = reg.RegisterID,
                    eventID = reg.EventID,
                    userID = reg.UserID,
                    eventData = await _eventRepo.GetEventByIdAsync(reg.EventID)
                });
            }

            return Ok(new
            {
                status = 200,
                success = true,
                message = "User registrations fetched successfully",
                data = mergedRegs
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching registrations",
                error = ex.Message
            });
        }
    }

    // ✅ Get all participants of a specific event
    [HttpGet("event/{eventId}")]
    public async Task<IActionResult> GetByEvent(int eventId)
    {
        try
        {
            var participants = await _repo.GetByEventId(eventId);
            var mergedRegs = new List<object>();

            foreach (var reg in participants)
            {
                mergedRegs.Add(new
                {
                    registerID = reg.RegisterID,
                    eventID = reg.EventID,
                    userID = reg.UserID,
                    eventData = await _eventRepo.GetEventByIdAsync(reg.EventID)
                });
            }

            return Ok(new
            {
                status = 200,
                success = true,
                message = "Event participants fetched successfully",
                data = mergedRegs
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching event registrations",
                error = ex.Message
            });
        }
    }

}