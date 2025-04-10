import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoodEntry } from "@/types/mood";
import { toast } from "sonner";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { Download, FileText, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ExportReports = () => {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState("week");
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchMoodData = async () => {
    try {
      setLoading(true);

      // Calculate date range based on selected time frame
      let startDate;
      const now = new Date();

      if (timeFrame === "week") {
        startDate = subWeeks(now, 1);
      } else if (timeFrame === "month") {
        startDate = subMonths(now, 1);
      } else if (timeFrame === "3months") {
        startDate = subMonths(now, 3);
      } else if (timeFrame === "year") {
        startDate = subMonths(now, 12);
      } else {
        startDate = subDays(now, 1);
      }

      // Import URL in Environment Variable for backend data transfer/receive
      const url = import.meta.env.VITE_URL;

      // Get Token from local storage and send it to backend to get mood data
      const storedUser = localStorage.getItem("mockToken");
      let storedEntries;
      if (storedUser) {
        await fetch(url + "/api/auth/authenticate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jwtToken: storedUser }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error != undefined && data.error != "") {
              toast.error(data.error);
              return;
            } else {
              // data: {_id: '67f02e433c85f911cd975c99', username: 'a', email: 'a@a.com', data: '', __v: 0} ==> data(.then(data=>{})).data(data: {_id...}).data('required data field')
              storedEntries = data.data.data;
            }
          });
      }

      // If entries were found else take them as an empty array
      let entries = storedEntries ? JSON.parse(storedEntries) : [];
      if (!storedEntries) {
        return [];
      }

      // Filter entries based on date range
      return entries.filter((entry: MoodEntry) => {
        // If created_at is missing, use current date as fallback
        const entryCreatedAt = entry.created_at || new Date().toISOString();
        const entryDate = new Date(entryCreatedAt);
        return entryDate >= startDate && entryDate <= now;
      });
    } catch (error) {
      console.error("Error fetching mood data:", error);
      toast.error("Failed to fetch mood data for export");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data: any[]) => {
    // Define headers based on options
    let headers = ["Date", "Mood", "Mood Intensity", "Energy Level"];

    if (includeNotes) {
      headers.push("Notes");
    }

    if (includeTags) {
      headers.push("Tags");
    }

    // Generate CSV content
    let csvContent = headers.join(",") + "\n";

    data.forEach((entry) => {
      // Use entry.date if created_at is missing
      const entryDate = entry.created_at
        ? format(new Date(entry.created_at), "yyyy-MM-dd")
        : entry.date;

      const row = [entryDate, entry.mood_name, entry.mood, entry.energy];

      if (includeNotes) {
        // Escape any commas in notes
        const safeNote = entry.note
          ? `"${entry.note.replace(/"/g, '""')}"`
          : "";
        row.push(safeNote);
      }

      if (includeTags && entry.tags) {
        // Join tags with semicolons and wrap in quotes to avoid CSV issues
        const tagsList = entry.tags.map((tag: any) => tag.name).join("; ");
        row.push(`"${tagsList}"`);
      }

      csvContent += row.join(",") + "\n";
    });

    return csvContent;
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    try {
      const data = await fetchMoodData();

      if (!data || data.length === 0) {
        toast.warning("No mood data found for the selected period");
        return;
      }

      const csvContent = generateCSV(data);
      const filename = `mood-report-${timeFrame}-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.csv`;

      downloadCSV(csvContent, filename);
      toast.success("Mood data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export mood data");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Export Your Mood Data
        </CardTitle>
        <CardDescription>
          Download your mood entries for analysis or sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Period</label>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="day" className="hover:bg-accent">
                Last 24 Hours
              </SelectItem>
              <SelectItem value="week" className="hover:bg-accent">
                Last Week
              </SelectItem>
              <SelectItem value="month" className="hover:bg-accent">
                Last Month
              </SelectItem>
              <SelectItem value="3months" className="hover:bg-accent">
                Last 3 Months
              </SelectItem>
              <SelectItem value="year" className="hover:bg-accent">
                Last Year
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Export Options</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeNotes"
                checked={includeNotes}
                onCheckedChange={(checked) =>
                  setIncludeNotes(checked as boolean)
                }
              />
              <Label htmlFor="includeNotes">Include Notes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTags"
                checked={includeTags}
                onCheckedChange={(checked) =>
                  setIncludeTags(checked as boolean)
                }
              />
              <Label htmlFor="includeTags">Include Tags</Label>
            </div>
          </div>
        </div>

        <Button className="w-full" onClick={handleExport} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing Export...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportReports;
