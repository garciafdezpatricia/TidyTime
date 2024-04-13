import CalendarPanel from "@/src/components/Panel/CalendarPreferences/CalendarPanel";
import ApplicationPanel from "../../src/components/Panel/ApplicationPreferences/ApplicationPanel";

// go to this page as /settings
export default function Settings() {
    return (
    <div className="settings-container">
        <CalendarPanel />
        <ApplicationPanel />
    </div>)
}