using Microsoft.EntityFrameworkCore;

public class EventRepository : IEventRepository
{
    private readonly AppDbContext _context;
    public EventRepository(AppDbContext context) => _context = context;

    public async Task<List<Event>> GetAll() => await _context.Events.ToListAsync();
    public async Task<Event> GetEventByIdAsync(int id) => await _context.Events.AsNoTracking().FirstOrDefaultAsync(e => e.EventID == id);
    public async Task<List<Event>> GetByCreator(int userId) => await _context.Events.Where(e => e.UserID == userId).ToListAsync();
    public async Task Add(Event ev)
    {
        _context.Events.Add(ev);
        await _context.SaveChangesAsync();
    }
    public async Task Update(Event ev)
    {
        _context.Events.Update(ev);
        await _context.SaveChangesAsync();
    }
    public async Task Delete(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev != null)
        {
            _context.Events.Remove(ev);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId)
    {
        return await _context.Events
                             .Where(e => e.UserID == userId)
                             .ToListAsync();
    }

    public async Task<int> CountParticipantsForEventsAsync(List<int> eventIds)
    {
        return await _context.Registrations
            .Where(r => eventIds.Contains(r.EventID))
            .CountAsync();
    }

    public async Task DeleteEventWithRegistrationsAsync(int eventId)
    {
        // Delete all registrations for the event
        var regs = await _context.Registrations
                                 .Where(r => r.EventID == eventId)
                                 .ToListAsync();

        if (regs.Any())
        {
            _context.Registrations.RemoveRange(regs);
            await _context.SaveChangesAsync();
        }

        // Delete the event
        var evt = await _context.Events.FindAsync(eventId);
        if (evt != null)
        {
            _context.Events.Remove(evt);
            await _context.SaveChangesAsync();
        }
    }

}