using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class RegistrationController : ControllerBase
{
    private readonly IRegistrationRepository _registrationRepo;
    private readonly IEventRepository _eventRepo;
    private readonly IUserRepository _userRepo;

    public RegistrationController(IRegistrationRepository repo, IEventRepository eventRepo, IUserRepository userRepo)
    {
        _registrationRepo = repo;
        _eventRepo = eventRepo;
        _userRepo = userRepo;
    }

    public async Task<IActionResult> GetAll()
    {
        try
        {
            var registrations = await _registrationRepo.GetAll();
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
            await _registrationRepo.Register(reg);

            var eventDetails = await _eventRepo.GetEventByIdAsync(reg.EventID);

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
                    Event = eventDetails
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
            var registrations = await _registrationRepo.GetByUserId(userId);
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
            var participants = await _registrationRepo.GetByEventId(eventId);
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