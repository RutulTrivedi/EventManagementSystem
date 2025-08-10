using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserRepository _userRepo;

    public AuthController(IAuthService authService, IUserRepository userRepo)
    {
        _authService = authService;
        _userRepo = userRepo;
    }

    // ✅ LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] JsonElement userInput)
    {
        try
        {
            string? email = userInput.GetProperty("userEmail").GetString();
            string? password = userInput.GetProperty("userPassword").GetString();

            var user = await _authService.Validate(email!, password!);

            if (user == null)
                return Unauthorized(new
                {
                    status = 401,
                    success = false,
                    message = "Invalid credentials"
                });

            var token = _authService.GenerateJwt(user);
            user.UserPassword = null;

            return Ok(new
            {
                status = 200,
                success = true,
                message = "Login successful",
                data = new { token, user }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred during login",
                error = ex.Message
            });
        }
    }

    // ✅ REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User newUser)
    {
        try
        {
            var existing = await _userRepo.GetByEmail(newUser.UserEmail);
            if (existing != null)
                return BadRequest(new
                {
                    status = 400,
                    success = false,
                    message = "Email already registered"
                });

            newUser.CreatedAt = DateTime.UtcNow;
            await _userRepo.Add(newUser);
            newUser.UserPassword = null;

            var token = _authService.GenerateJwt(newUser);

            return Ok(new
            {
                status = 200,
                success = true,
                message = "Registration successful",
                data = new { token, user = newUser }
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
}