import React, { useEffect, useState } from "react";
import api from "../../../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD NOTIFICATIONS ================= */
  const loadNotifications = async () => {
    try {
      const res = await api.get("/doctor/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading notifications...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        Notifications
      </h2>

      {notifications.length === 0 && (
        <p className="text-gray-500">
          No notifications found
        </p>
      )}

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`border rounded-lg p-4 shadow-sm ${
              n.is_read
                ? "bg-white"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">
                  {n.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {n.message}
                </p>
              </div>

              {!n.is_read && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
