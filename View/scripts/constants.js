export const MSG_TYPE = Object.freeze({
  success: "success",
  error: "error",
  info: "info",
});

export const ICONS = Object.freeze({
  [MSG_TYPE.success]: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="10" stroke="#28a745" stroke-width="2" fill="#28a745"/>
        <path d="M9 12l2 2 4-4" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
  [MSG_TYPE.error]: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="10" stroke="#dc3545" stroke-width="2" fill="#dc3545"/>
        <line x1="9" y1="9" x2="15" y2="15" stroke="#333" stroke-width="2" stroke-linecap="round"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="#333" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
  [MSG_TYPE.info]: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="10" stroke="#007bff" stroke-width="2" fill="#007bff"/>
        <line x1="12" y1="16" x2="12" y2="12" stroke="#333" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="8" r="1" fill="#333"/>
      </svg>
    `,
});

export const TOAST_AUTO_HIDE_TIME = Object.freeze({
  [MSG_TYPE.success]: 6000,
  [MSG_TYPE.error]: 10000,
  [MSG_TYPE.info]: 4000,
});