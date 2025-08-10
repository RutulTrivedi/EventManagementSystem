using Microsoft.EntityFrameworkCore;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;
    public UserRepository(AppDbContext context) => _context = context;

    public async Task<User> GetByEmail(string email) => await _context.Users.FirstOrDefaultAsync(u => u.UserEmail == email);
    public async Task<User> GetById(int id) => await _context.Users.FindAsync(id);
    public async Task<List<User>> GetAll() => await _context.Users.ToListAsync();
    public async Task Add(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }
    public async Task Update(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}