public class Event
{
    public int EventID { get; set; }
    public string EventTitle { get; set; }
    public string EventDescription { get; set; }
    public string EventLocation { get; set; }
    public DateTime EventDateTime { get; set; }
    public int UserID { get; set; }
    public DateTime CreatedAt { get; set; }
}