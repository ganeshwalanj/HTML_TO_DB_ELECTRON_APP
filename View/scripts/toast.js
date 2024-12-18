import { ICONS, TOAST_AUTO_HIDE_TIME } from "./constants.js";

// Function to show toast
export function showToast(type, message) {
  const toastContainer = document.getElementById("toast-container");

  // Create a new toast element
  const toast = document.createElement("div");
  // Set the custom data attribute for managing the closed state
  toast.dataset.isClosedManually = "false";
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
      <span class="toast-icon">
        ${ICONS[type] || ""}
      </span>
      <span class="toast-message">${message}</span>
      <button class="close-btn" onclick="closeToast(this)">×</button>
    `;

  // Append the toast to the toast container
  toastContainer.appendChild(toast);

  // Make the toast visible by adding the 'show' class
  setTimeout(() => {
    toast.classList.add("show");
  }, 10); // Short delay to allow DOM rendering

  // Automatically hide the toast after 5 seconds
  setTimeout(() => {
    if (toast.dataset.isClosedManually === "false") {
      toast.classList.add("hide"); // Start fade-out animation
      setTimeout(() => {
        toastContainer.removeChild(toast); // Remove the toast from the DOM
      }, 500); // Wait for the fade-out animation to complete
    }
  }, TOAST_AUTO_HIDE_TIME[type]);
}

// Function to close a toast manually (when the close button is clicked)
export function closeToast(button) {
  const toast = button.parentElement; // Get the toast element
  toast.dataset.isClosedManually = "true";
  toast.classList.add("hide"); // Start fade-out animation
  setTimeout(() => {
    toast.remove(); // Remove the toast from the DOM after the animation
  }, 500); // Delay to allow fade-out animation
}

// Export the function so it's available globally
window.closeToast = closeToast;
