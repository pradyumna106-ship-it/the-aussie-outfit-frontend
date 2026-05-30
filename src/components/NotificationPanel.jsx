import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  Truck,
  CreditCard,
  ShoppingBag,
  Shield,
  Megaphone
} from "lucide-react";

function NotificationPanel({
  notifications = [],
  onClose,
  onMarkAsRead,
  onMarkAllAsRead
}) {

  // UNREAD COUNT

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // FORMAT TIME

  const formatTime = (notification) => {

    if (!notification.createdAt) {
      return "Just now";
    }

    const now = Date.now();

    const diffMs =
      now - new Date(notification.createdAt).getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  // ICONS BASED ON TYPE

  const getNotificationIcon = (type) => {

    switch (type) {

      case "ORDER":
        return (
          <div className="bg-orange-100 p-2 rounded-full">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
          </div>
        );

      case "PAYMENT":
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
        );

      case "DELIVERY":
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
        );

      case "PROMOTION":
        return (
          <div className="bg-pink-100 p-2 rounded-full">
            <Megaphone className="w-5 h-5 text-pink-600" />
          </div>
        );

      case "SECURITY":
        return (
          <div className="bg-red-100 p-2 rounded-full">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
        );

      case "SYSTEM":
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <Info className="w-5 h-5 text-gray-600" />
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <Bell className="w-5 h-5 text-gray-600" />
          </div>
        );
    }
  };

  // STATUS COLORS

  const getStatusColor = (status) => {

    switch (status) {

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "SENT":
        return "bg-blue-100 text-blue-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "READ":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (

    <div
      className="
        absolute
        right-[20px]
        top-[75px]
        w-[420px]
        bg-white
        rounded-3xl
        shadow-2xl
        border
        border-[#e5e7eb]
        z-50
        overflow-hidden
        flex
        flex-col
        max-h-[650px]
      "
    >

      {/* HEADER */}

      <div
        className="
          px-5
          py-4
          flex
          items-center
          justify-between
          bg-gradient-to-r
          from-[#012A4A]
          via-[#013A63]
          to-[#01497C]
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              w-10
              h-10
              rounded-full
              bg-white/20
              flex
              items-center
              justify-center
            "
          >
            <Bell className="w-5 h-5 text-white" />
          </div>

          <div>

            <h2 className="text-white text-lg font-bold">
              Notifications
            </h2>

            <p className="text-white/70 text-xs">
              Everything Australia
            </p>

          </div>

          {unreadCount > 0 && (
            <div
              className="
                bg-red-500
                text-white
                text-xs
                font-bold
                px-2
                py-1
                rounded-full
              "
            >
              {unreadCount}
            </div>
          )}

        </div>

        <button
          onClick={onClose}
          className="
            text-white
            hover:bg-white/20
            p-2
            rounded-full
            transition-all
          "
        >
          <X className="w-5 h-5" />
        </button>

      </div>

      {/* MARK ALL READ */}

      {unreadCount > 0 && (

        <div
          className="
            px-5
            py-3
            border-b
            border-gray-100
            bg-[#f8fafc]
          "
        >

          <button
            onClick={onMarkAllAsRead}
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#01497C]
              hover:text-[#012A4A]
              transition-all
            "
          >
            <Check className="w-4 h-4" />

            Mark all as read
          </button>

        </div>
      )}

      {/* NOTIFICATIONS */}

      <div className="overflow-y-auto flex-1">

        {notifications.length === 0 ? (

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-20
              px-6
              text-center
            "
          >

            <div
              className="
                w-20
                h-20
                rounded-full
                bg-gray-100
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <Bell className="w-10 h-10 text-gray-400" />
            </div>

            <h3 className="text-lg font-bold text-gray-700">
              No Notifications
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              You are all caught up.
            </p>

          </div>

        ) : (

          notifications.map((notification) => (

            <div
              key={notification._id}
              onClick={() => onMarkAsRead(notification._id)}
              className={`
                relative
                px-5
                py-4
                border-b
                border-gray-100
                cursor-pointer
                transition-all
                hover:bg-[#f9fafb]
                ${
                  !notification.isRead
                    ? "bg-[#eef6ff]"
                    : "bg-white"
                }
              `}
            >

              <div className="flex gap-4">

                {/* ICON */}

                <div className="shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* CONTENT */}

                <div className="flex-1 min-w-0">

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h3
                        className={`
                          text-sm
                          font-bold
                          ${
                            !notification.isRead
                              ? "text-[#012A4A]"
                              : "text-gray-700"
                          }
                        `}
                      >
                        {notification.title}
                      </h3>

                      <p
                        className="
                          text-sm
                          text-gray-600
                          mt-1
                          leading-relaxed
                        "
                      >
                        {notification.message}
                      </p>

                    </div>

                    {!notification.isRead && (

                      <div
                        className="
                          w-3
                          h-3
                          rounded-full
                          bg-blue-600
                          mt-1
                          shrink-0
                        "
                      />

                    )}

                  </div>

                  {/* FOOTER */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mt-3
                    "
                  >

                    <span
                      className={`
                        text-[11px]
                        px-2
                        py-1
                        rounded-full
                        font-semibold
                        ${getStatusColor(notification.status)}
                      `}
                    >
                      {notification.status}
                    </span>

                    <span className="text-xs text-gray-400">
                      {formatTime(notification)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

      {/* FOOTER */}

      <div
        className="
          px-5
          py-3
          bg-gray-50
          border-t
          border-gray-100
          text-center
        "
      >

        <p className="text-xs text-gray-500">
          Everything Australia Notifications Center
        </p>

      </div>

    </div>
  );
}

export default NotificationPanel;