const fs = require("fs");
const cheerio = require("cheerio");
const sql = require("mssql");
const { MSG_TYPE } = require("./constants");
/**
 * Start the insertion process.
 *
 * @param {Object} args - The arguments for the operation.
 * @param {string} args.server - The MSSQL server address.
 * @param {number} args.sqlport - The MSSQL server port.
 * @param {string} args.user - The database user name.
 * @param {string} args.password - The database password.
 * @param {string} args.database - The database name.
 * @param {string} args.tableName - The table name to insert data into.
 * @param {string} args.htmlFile - The path to the HTML file.
 * @param {Function} sendStatusUpdate - Function to send status updates to the renderer process.
 */
async function startInsertion(args, sendStatusUpdate) {
  const { server, sqlport, user, password, database, tableName, htmlFile } =
    args;

  let pool;
  try {
    const $ = cheerio.load(htmlFile);

    // Extract column names dynamically from the first row
    const columnNames = [];
    const firstRow = $("tr").first();
    firstRow.find("th, td").each((index, element) => {
      columnNames.push($(element).text().trim());
    });

    sendStatusUpdate(
      MSG_TYPE.info,
      `Extracted Columns: ${columnNames.join(", ")}`
    );

    // Database configuration
    const dbConfig = {
      user,
      password,
      server,
      database,
      port: sqlport,
      options: {
        encrypt: true, // Enable encryption for Azure SQL
        trustServerCertificate: true, // For local development
      },
    };

    // Connect to the database
    pool = await sql.connect(dbConfig);
    sendStatusUpdate(MSG_TYPE.success, "Connected to the MSSQL database.");

    // Build the dynamic INSERT query
    const columnsSQL = columnNames.map((col) => `[${col}]`).join(", ");
    const firstCol = columnNames[0];
    const sqlQuery = `
    IF NOT EXISTS (SELECT TOP 1 NULL FROM ${tableName} WHERE ${firstCol} = @${firstCol})
    BEGIN
    INSERT INTO ${tableName} (${columnsSQL}) VALUES (${columnNames
      .map((col) => `@${col}`)
      .join(", ")})
    END`;

    sendStatusUpdate(MSG_TYPE.info, "Prepared SQL query.");

    // Insert data row by row
    const rows = $("tr").slice(1);
    for (let index = 0; index < rows.length; index++) {
      const element = rows[index];
      const rowData = {};

      $(element)
        .find("td")
        .each((i, td) => {
          rowData[columnNames[i]] = $(td).text().trim();
        });

      try {
        const request = pool.request();
        columnNames.forEach((col) => {
          request.input(col, rowData[col] || null);
        });

        const res = await request.query(sqlQuery);
        if (res.rowsAffected > 0) {
          sendStatusUpdate(
            MSG_TYPE.success,
            `Inserted row ${index + 1} successfully.`
          );
        }
      } catch (err) {
        sendStatusUpdate(
          MSG_TYPE.error,
          `Error inserting row ${index + 1}: ${err.message}`
        );
      }
    }

    sendStatusUpdate(MSG_TYPE.success, "All rows processed.");
  } catch (err) {
    sendStatusUpdate(MSG_TYPE.error, `An error occurred: ${err.message}`);
  } finally {
    if (pool) {
      await pool.close();
      sendStatusUpdate(MSG_TYPE.info, "Database connection closed.");
    }
  }
}

module.exports = { startInsertion }; // Export
