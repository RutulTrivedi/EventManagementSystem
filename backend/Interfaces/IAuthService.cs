public interface IAuthService
{
    Task<User> Validate(string email, string password);
    string GenerateJwt(User user);
}