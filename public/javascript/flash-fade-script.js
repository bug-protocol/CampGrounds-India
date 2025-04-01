// This script is used to fade out flash messages after a certain duration
    setTimeout(() => {
        document.querySelectorAll('.alert').forEach(alert => alert.remove());
    }, 3000); // Disappears after 3 seconds

