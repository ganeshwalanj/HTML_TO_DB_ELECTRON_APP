import { showToast } from "./scripts/toast.js";

document.getElementById("dbForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const server = document.getElementById("server").value || undefined;
  const sqlport = Number(document.getElementById("sqlport").value) || undefined;
  const user = document.getElementById("user").value || undefined;
  const password = document.getElementById("password").value || undefined;
  const database = document.getElementById("database").value || undefined;
  const tableName = document.getElementById("tableName").value || undefined;

  const file = document.getElementById("htmlFile").files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      let htmlFile = e.target.result;

      window.electronAPI.startInsertion({
        server,
        sqlport,
        user,
        password,
        database,
        tableName,
        htmlFile,
      });
    };
    reader.readAsText(file);
  } else {
    window.electronAPI.sendToMain("start-insertion", {
      server,
      sqlport,
      user,
      password,
      database,
      tableName,
    });
  }
});

window.electronAPI.onStatusUpdate((type, message) => {
  showToast(type, message);
});