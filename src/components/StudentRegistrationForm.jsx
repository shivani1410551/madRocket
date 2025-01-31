import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { db } from "./firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import "../styles/StudentRegistrationForm.css";

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "in", label: "India" },
];

const StudentRegistrationForm = ({ onCloseModal, onSubmit, defaultValues, isEditing, studentId }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: defaultValues || {}
  });

  const handleAddStudent = async (data) => {
    try {

      if (isEditing) {
        const studentRef = doc(db, "students", studentId);
        await updateDoc(studentRef, {
          ...data,
          updatedAt: new Date(),
        });

        onSubmit({ ...data, id: studentId });
      } else {

        const docRef = await addDoc(collection(db, "students"), {
          ...data,
          createdAt: new Date(),
        });

        const studentWithId = {
          ...data,
          id: docRef.id,
        };

        onSubmit(studentWithId);
      }

      reset();
      onCloseModal();
    } catch (error) {
      console.error("Error adding/updating student: ", error);
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? "Edit Student" : "Student Registration"}</h2>
      <form onSubmit={handleSubmit(handleAddStudent)}>
        <div className="row">
          <div className="half-width">
            <label>First Name</label>
            <input {...register("firstName", { required: "First Name is required" })} />
            {errors.firstName && <span className="error">{errors.firstName.message}</span>}
          </div>
          <div className="half-width">
            <label>Last Name</label>
            <input {...register("lastName", { required: "Last Name is required" })} />
            {errors.lastName && <span className="error">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="row">
          <div className="half-width">
            <label>Date of Birth</label>
            <input type="date" {...register("dob", { required: "Date of Birth is required" })} />
            {errors.dob && <span className="error">{errors.dob.message}</span>}
          </div>
          <div className="half-width">
            <label>Roll Number</label>
            <input
              type="number"
              {...register("rollNumber", {
                required: "Roll Number is required",
                min: { value: 1, message: "Roll Number must be greater than 0" },
              })}
            />
            {errors.rollNumber && <span className="error">{errors.rollNumber.message}</span>}
          </div>
        </div>

        <div className="row">
          <div className="half-width">
            <label>Phone Number</label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone Number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone Number must be 10 digits",
                },
              })}
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>
          <div className="half-width">
            <label>Grade</label>
            <input
              type="number"
              {...register("grade", {
                required: "Grade is required",
                min: { value: 1, message: "Grade must be between 1 and 12" },
                max: { value: 12, message: "Grade must be between 1 and 12" },
              })}
            />
            {errors.grade && <span className="error">{errors.grade.message}</span>}
          </div>
        </div>

        <div className="row full-width">
          <label>Street Address</label>
          <input {...register("streetAddress", { required: "Street Address is required" })} />
          {errors.streetAddress && <span className="error">{errors.streetAddress.message}</span>}
        </div>

        <div className="row">
          <div className="half-width">
            <label>City</label>
            <input {...register("city", { required: "City is required" })} />
            {errors.city && <span className="error">{errors.city.message}</span>}
          </div>
          <div className="half-width">
            <label>Postal Code</label>
            <input
              type="text"
              {...register("postalCode", {
                required: "Postal Code is required",
                pattern: { value: /^[0-9]+$/, message: "Postal Code must contain only numbers" }
              })}
            />
            {errors.postalCode && <span className="error">{errors.postalCode.message}</span>}
          </div>
        </div>

        <div className="row full-width">
          <label>Country</label>
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={countries}
                value={countries.find((option) => option.value === field.value)}
                isClearable
                onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : null)}
              />
            )}
          />
          {errors.country && <span className="error">{errors.country.message}</span>}
        </div>

        <div className="row">
          <div className="half-width">
            <label>Academic Area</label>
            <input {...register("academicArea", { required: "Academic Area is required" })} />
            {errors.academicArea && <span className="error">{errors.academicArea.message}</span>}
          </div>
          <div className="half-width">
            <label>Exam Grade</label>
            <input
              type="number"
              {...register("examGrade", { required: "Exam Grade is required" })}
            />
            {errors.examGrade && <span className="error">{errors.examGrade.message}</span>}
          </div>
        </div>

        <button type="submit">{isEditing ? "Update" : "Register"}</button>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;
