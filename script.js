const form = document.getElementById("form");
const formButton = document.getElementById("formbtn");
const tableContainer = document.getElementById("table");
const search = document.getElementById("search-box");
let formmode = 0;
let studentData = JSON.parse(localStorage.getItem("studentData") ?? "[]");
let studentCount =
  localStorage.getItem("studentCount") ?? Math.round(Math.random() * 1000000);

// functions
// adding new students on click
function addStudent() {
  let newstudent = {
    _id: ++studentCount,
    name: "",
    email: "",
    gpa: "",
    age: "",
    degree: "",
  };
  for (const key in newstudent)
    if (form[key].type !== "hidden") newstudent[key] = form[key].value;
  studentData.push(newstudent);
  localStorage.setItem("studentData", JSON.stringify(studentData));
  localStorage.setItem("studentCount", studentCount);
  form.reset();
  display(studentData);
}

// handling click ev for edit of student
function handleStudentEdit(id) {
  formmode = 1;
  edit_id.innerText = `(Editing Student ID: ${id})`;
  formButton.value = "Edit Student";
  const stData = studentData.find((student) => student._id === id);
  for (const key in stData) form[key].value = stData[key];
}

// editing student
function editStudent() {
  let stData = studentData.find(
    (student) => student._id === Number(form._id.value)
  );
  for (const key in stData)
    if (form[key].type !== "hidden") stData[key] = form[key].value;
  localStorage.setItem("studentData", JSON.stringify(studentData));
  display(studentData);
  handleReset();
}

// autofill student details
function handleAutofill() {
  const degrees = [
    "AA",
    "AAA",
    "AE",
    "AS",
    "AGS",
    "ASN",
    "AF",
    "BArch",
    "BA",
    "AB",
    "BS",
    "BSc",
    "SB",
    "ScB",
    "BAA",
    "BEng",
    "BE",
    "BSE",
    "BESc",
    "BSEng",
    "BASc",
    "BTech",
    "BSc(Eng)",
    "AMIE",
    "GradIETE",
  ];
  let newstudent = {
    name: generateRandomName(),
    email: generateRandomName("email"),
    gpa: generateRandom(0, 10),
    age: generateRandom(1, 50),
    degree: degrees[generateRandom(0, degrees.length - 1)],
  };
  for (const key in newstudent) form[key].value = newstudent[key];
}

// deleting student
function handleStudentDelete(id) {
  if (confirm("Delete this student?")) {
    studentData = studentData.filter((student) => student._id !== id);
    localStorage.setItem("studentData", JSON.stringify(studentData));
    display(studentData);
    handleReset();
  }
}

// displaying the student data from the params array
function display(data) {
  document.getElementById("tbody").remove();
  const newTbody = document.createElement("tbody");
  if (data.length > 0)
    data.forEach((student, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td colspan="1" role="row">${i + 1}</td>
                <td colspan="5">${student.name}</td>
                <td colspan="5">${student.email}</td>
                <td colspan="2">${student.age}</td>
                <td colspan="2">${student.gpa}</td>
                <td colspan="3">${student.degree}</td>
                <td>
                  <img src="edit.svg" height="16" onclick="handleStudentEdit(${
                    student._id
                  })"></img>
                  <img src="trash.svg" height="16" onclick="handleStudentDelete(${
                    student._id
                  })"></img>
                </td>
                `;
      newTbody.appendChild(row);
    });
  else {
    const row = document.createElement("tr");
    row.innerHTML = `
                <td colspan="1" role="row">--</td>
                <td colspan="5">--</td>
                <td colspan="5">--</td>
                <td colspan="2">--</td>
                <td colspan="2">--</td>
                <td colspan="3">--</td>
                <td>--</td>
                `;
    newTbody.appendChild(row);
  }
  newTbody.id = "tbody";
  tableContainer.append(newTbody);
}

// filtering the student array according to whatever is searched
function handleSearch() {
  if (!search.value) display(studentData);
  else {
    const regex = new RegExp(search.value, "gi");
    let newData = [...studentData];
    newData = newData.filter(
      (student) =>
        regex.test(student.name) ||
        regex.test(student.email) ||
        regex.test(student.age) ||
        regex.test(student.gpa) ||
        regex.test(student.degree)
    );
    display(newData);
  }
}

// handle what to do when form is reset
function handleReset() {
  formmode = 0;
  edit_id.innerText = "";
  formButton.value = "Add Student";
  form.reset();
}

// generates random number between given limit
function generateRandom(start = 1, stop = 100) {
  return Math.round(Math.random() * (stop - start) + start);
}

// generates random name
function generateRandomName(type = "name") {
  const vowels = "aeiou";
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const nameLength = Math.random(Math.random() * 4) + 4;
  let name = "";
  let useVowel = Math.random() < 0.5;
  for (let i = 0; i < nameLength; i++) {
    if (useVowel) name += vowels[generateRandom(0, 4)];
    else name += consonants[generateRandom(0, 20)];
    useVowel = !useVowel;
  }
  return type === "name" ? name : name + "@gmail.com";
}

// main logic
document.onload = display(studentData);
search.addEventListener("keyup", handleSearch);
form.onsubmit = () => {
  formmode === 0 ? addStudent() : editStudent();
  // return true will call for action and reload the page
  return false;
};