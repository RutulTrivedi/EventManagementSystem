using Microsoft.EntityFrameworkCore;

public class RegistrationRepository : IRegistrationRepository
{
    private readonly AppDbContext _context;
    public RegistrationRepository(AppDbContext context) => _context = context;

    public async Task<List<Registration>> GetAll() => await _context.Registrations.ToListAsync();
    public async Task<List<Registration>> GetByEventId(int eventId) => await _context.Registrations.Where(r => r.EventID == eventId).ToListAsync();
    public async Task<List<Registration>> GetByUserId(int userId) => await _context.Registrations.Where(r => r.UserID == userId).ToListAsync();
    public async Task Register(Registration reg)
    {
        _context.Registrations.Add(reg);
        await _context.SaveChangesAsync();
    }
}