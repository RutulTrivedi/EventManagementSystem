public interface IUserRepository
{
    Task<User> GetByEmail(string email);
    Task<User> GetById(int id);
    Task<List<User>> GetAll();
    Task Add(User user);
    Task Update(User user);
}
