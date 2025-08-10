public interface IEventRepository
{
    Task<List<Event>> GetAll();
    Task<Event> GetEventByIdAsync(int id);
    Task<List<Event>> GetByCreator(int userId);
    Task Add(Event ev);
    Task Update(Event ev);
    Task Delete(int id);
    Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId);
    Task<int> CountParticipantsForEventsAsync(List<int> eventIds);
}