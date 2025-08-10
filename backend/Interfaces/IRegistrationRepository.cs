public interface IRegistrationRepository
{
    Task<List<Registration>> GetAll();
    Task<List<Registration>> GetByEventId(int eventId);
    Task<List<Registration>> GetByUserId(int userId);
    Task Register(Registration reg);
}
