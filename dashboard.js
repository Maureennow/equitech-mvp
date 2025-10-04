// Preloaded demo students
if (!localStorage.getItem("students")) {
  const demoStudents = [
    { name: "Amina", modulesCompleted: [100, 80, 60] },
    { name: "Evan", modulesCompleted: [90, 100, 70] },
    { name: "Robyn", modulesCompleted: [75, 60, 100] },
    { name: "Tariq", modulesCompleted: [50, 70, 90] },
    { name: "Lila", modulesCompleted: [80, 85, 95] },
  ];
  localStorage.setItem("students", JSON.stringify(demoStudents));
}

// Load dashboard
function loadStudentProgress() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const tbody = document.querySelector("#progress-table tbody");
  tbody.innerHTML = "";

  const moduleCount = 3;
  const passingScore = 70; // ✅ threshold

  // Populate student rows
  students.forEach((student) => {
    const row = document.createElement("tr");

    // Student name
    const nameCell = document.createElement("td");
    nameCell.textContent = student.name;
    row.appendChild(nameCell);

    // Module scores
    for (let i = 0; i < moduleCount; i++) {
      const cell = document.createElement("td");
      const rawScore = student.modulesCompleted[i] || 0;

      // Cap at 100%
      const score = Math.min(rawScore, 100);

      // Display with checkmark if passing
      cell.textContent = `${score}% ${score >= passingScore ? "✅" : "❌"}`;
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  });

  // Analytics
  const moduleScores = Array(moduleCount).fill(0);
  const completionCounts = Array(moduleCount).fill(0);

  students.forEach((student) => {
    student.modulesCompleted.forEach((score, i) => {
      const cappedScore = Math.min(score || 0, 100);
      moduleScores[i] += cappedScore;
      if (cappedScore >= passingScore) completionCounts[i]++;
    });
  });

  const totalStudents = students.length || 1;

  // Update header with completion %
  const headerCells = document.querySelector("#progress-table thead tr").cells;
  for (let i = 0; i < moduleCount; i++) {
    const percentComplete = Math.round(
      (completionCounts[i] / totalStudents) * 100
    );
    headerCells[i + 1].textContent = `Module ${i + 1} (${percentComplete}%)`;
  }

  // Update analytics summary
  const avgScores = moduleScores.map((total) =>
    Math.round(total / totalStudents)
  );
  document.getElementById("analytics-summary").innerHTML = `
    Total students: ${totalStudents} <br>
    Average Scores per Module: Module 1: ${avgScores[0]}%, Module 2: ${avgScores[1]}%, Module 3: ${avgScores[2]}%
  `;
}

// Run dashboard on load
loadStudentProgress();
