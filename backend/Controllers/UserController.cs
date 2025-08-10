using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserRepository _repo;

    public UserController(IUserRepository repo)
    {
        _repo = repo;
    }

    // ✅ Get all users
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var users = await _repo.GetAll();
            return Ok(new
            {
                status = 200,
                success = true,
                message = "Users fetched successfully",
                data = users
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching users",
                error = ex.Message
            });
        }
    }

    // ✅ Update user by ID
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] User user)
    {
        try
        {
            if (id != user.UserID)
            {
                return BadRequest(new
                {
                    status = 400,
                    success = false,
                    message = "User ID mismatch"
                });
            }

            var existingUser = await _repo.GetById(id);
            if (existingUser == null)
            {
                return NotFound(new
                {
                    status = 404,
                    success = false,
                    message = "User not found"
                });
            }

            // ✅ Update only editable fields
            existingUser.UserFullName = user.UserFullName;
            existingUser.UserEmail = user.UserEmail;
            existingUser.UserMobile = user.UserMobile;
            // Keep role and password unchanged

            await _repo.Update(existingUser); // Pass the already tracked entity

            return Ok(new
            {
                status = 200,
                success = true,
                message = "User updated successfully",
                data = existingUser
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while updating the user",
                error = ex.Message
            });
        }
    }


    [HttpPost("checkpassword")]
    public async Task<IActionResult> CheckPassword([FromBody] JsonElement request)
    {
        try
        {
            if (!request.TryGetProperty("userID", out JsonElement idElement) ||
                !request.TryGetProperty("userPassword", out JsonElement passwordElement))
            {
                return BadRequest(new
                {
                    status = 400,
                    success = false,
                    message = "Missing userID or userPassword"
                });
            }

            int id = idElement.GetInt32();
            string password = passwordElement.GetString()!;

            var user = await _repo.GetById(id);
            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    success = false,
                    message = "User not found"
                });
            }

            bool isPasswordCorrect = user.UserPassword == password;

            return Ok(new
            {
                status = 200,
                success = true,
                message = isPasswordCorrect ? "Password is correct" : "Password is incorrect",
                data = isPasswordCorrect
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while checking password",
                error = ex.Message
            });
        }
    }

    // ✅ Get user by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var user = await _repo.GetById(id);
            if (user == null)
            {
                return NotFound(new
                {
                    status = 404,
                    success = false,
                    message = "User not found"
                });
            }

            return Ok(new
            {
                status = 200,
                success = true,
                message = "User fetched successfully",
                data = user
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                success = false,
                message = "An error occurred while fetching the user",
                error = ex.Message
            });
        }
    }
}