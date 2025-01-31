import { useState, useEffect } from "react";
import { db } from "../components/firebase";
import { collection, getDocs,addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import StudentRegistrationForm from "../components/StudentRegistrationForm";
import "../styles/Students.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchStudents = async () => {
    try {
      const studentsRef = collection(db, "students");
      const snapshot = await getDocs(studentsRef);
      const studentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

 const handleDelete = async (id) => {
  try {
    await deleteDoc(doc(db, "students", id));
    setStudents(students.filter((student) => student.id !== id));
  } catch (error) {
    console.error("Error deleting student:", error);
  }
};


const handleAddOrUpdateStudent = async (studentData) => {
  if (isEditing && selectedStudent) {
    try {
      const studentRef = doc(db, "students", selectedStudent.id);
      await updateDoc(studentRef, studentData);
      setStudents(
        students.map((s) => (s.id === selectedStudent.id ? { ...s, ...studentData } : s))
      );
    } catch (error) {
      console.error("Error updating student:", error);
    }
    setIsEditing(false);
    setSelectedStudent(null);
  } else {
    try {
      const newStudentRef = await addDoc(collection(db, "students"), studentData);
      const newStudent = { id: newStudentRef.id, ...studentData };
      setStudents([...students, newStudent]);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  }

  setIsModalOpen(false);
  setSelectedStudent(null);
  setIsEditing(false);
};

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  return (
    <div className="students-container">
      <h2>Students List</h2>
      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        Add Student
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Roll Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>
                {student.firstName} {student.lastName}
              </td>
              <td>{student.grade}</td>
              <td>{student.section || "N/A"}</td>
              <td>{student.rollNumber || "N/A"}</td>
              <td>
                <button className="view-btn" onClick={() => handleView(student)}>
                  View
                </button>
                <button className="edit-btn" onClick={() => handleEdit(student)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <StudentRegistrationForm
              onSubmit={handleAddOrUpdateStudent}
              onCloseModal={() => setIsModalOpen(false)}
              defaultValues={isEditing ? selectedStudent : undefined}
            />
          </div>
        </div>
      )}

      {isViewModalOpen && selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setIsViewModalOpen(false)}>
              &times;
            </span>
            <h3>{selectedStudent.firstName} {selectedStudent.lastName}</h3>
            <p><strong>Date of Birth:</strong> {selectedStudent.dob}</p>
            <p><strong>Phone Number:</strong> {selectedStudent.phone}</p>
            <p><strong>Grade:</strong> {selectedStudent.grade}</p>
            <p><strong>Street Address:</strong> {selectedStudent.streetAddress}</p>
            <p><strong>City:</strong> {selectedStudent.city}</p>
            <p><strong>Postal Code:</strong> {selectedStudent.postalCode}</p>
            <p><strong>Country:</strong> {selectedStudent.country?.label}</p>
            <p><strong>Academic Area:</strong> {selectedStudent.academicArea}</p>
            <p><strong>Exam Grade:</strong> {selectedStudent.examGrade}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
