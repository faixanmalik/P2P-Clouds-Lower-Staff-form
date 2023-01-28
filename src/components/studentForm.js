import React from "react";
import emptyProfile from "../Assets/Images/no_profile_picture.jpeg";
import "../App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"
import { db } from "../Firebase/config";
import { useState } from "react";

const studentFormInit = {
  firstname: "",
  lastname: "",
  cnic: "",
  dob: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
  parentname: "",
  parentphone: "",
  parentemail: "",
  parentcnic: "",
  initfees:"",
  courses:[],
  emergencyname: "",
  emergencyrelationship: "",
  emergencyphone: "",
  previousschoolname: "",
  previousschooladdress: "",
  studentphoto: "",
  studentcnicphoto: "",
  parentcnicphoto: "",
  medicalrecordsphoto: "",
  additionaldocuments: [],
};
const AddStudentForm = () => {
  const [studentForm, setStudentForm] = useState(studentFormInit);
  const [studentPhotoURL, setStudentPhotoURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false);
  
  const handleChange = (e) => {
    if (
      e.target.name === "studentphoto" ||
      e.target.name === "studentcnicphoto" ||
      e.target.name === "parentcnicphoto" ||
      e.target.name === "medicalrecordsphoto"
    ) {
      setStudentForm({ ...studentForm, [e.target.name]: e.target.files[0] });
      setStudentPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "additionaldocuments") {
      setStudentForm({ ...studentForm, [e.target.name]: e.target.files });
      
    } 
    else if(e.target.name==="courses"){
      const newForm=studentForm;
      newForm.courses.push(e.target.value);
      setStudentForm(newForm);
    }
    else {
      setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Create a reference to the students collection
    const studentsRef = db.collection("students");
    const { studentphoto, studentcnicphoto, parentcnicphoto, medicalrecordsphoto ,additionaldocuments} = studentForm;
    const studentTextForm=studentForm;
    studentTextForm.studentphoto="";
    studentTextForm.studentcnicphoto="";
    studentTextForm.parentcnicphoto="";
    studentTextForm.medicalrecordsphoto="";
    studentTextForm.additionaldocuments="";
    // Create a storage reference
    const storageRef =  firebase.storage().ref();

    let studentphotoURL = '';
    let studentcnicphotoURL = '';
    let parentcnicphotoURL = '';
    let medicalrecordsphotoURL = '';
     
  await studentsRef.add(studentTextForm).then(
    async(doc)=>{
      
      //Upload the files
     if (studentphoto) {
      const studentphotoSnapshot = await storageRef.child(`students/${doc.id}/studentphoto`).put(studentphoto);
      studentphotoURL = await studentphotoSnapshot.ref.getDownloadURL();
  }
  if (studentcnicphoto) {
      const studentcnicphotoSnapshot = await storageRef.child(`students/${doc.id}/studentcnic`).put(studentcnicphoto);
      studentcnicphotoURL = await studentcnicphotoSnapshot.ref.getDownloadURL();
  }
  if (parentcnicphoto) {
      const parentcnicphotoSnapshot = await storageRef.child(`students/${doc.id}/parentcnic`).put(parentcnicphoto);
      parentcnicphotoURL = await parentcnicphotoSnapshot.ref.getDownloadURL();
  }
  if (medicalrecordsphoto) {
      const medicalrecordphotoSnapshot = await storageRef.child(`students/${doc.id}/medicalrecord}`).put(medicalrecordsphoto);
      medicalrecordsphotoURL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
  }
  let additionalFiles=[];
  if (additionaldocuments) {
    for (var i = 0; i < additionaldocuments.length; i++) {
      const additionaldocumentsSnapshot = await storageRef.child(`students/${doc.id}/additionaldocument${i+1}`).put(additionaldocuments[i]);
        additionalFiles.push(await additionaldocumentsSnapshot.ref.getDownloadURL());
  }
      
      
  }

     // update the document with the file URLs
     await studentsRef.doc(doc.id).update({
      studentphoto: studentphotoURL,
      studentcnicphoto: studentcnicphotoURL,
      parentcnicphoto: parentcnicphotoURL,
      medicalrecordsphoto: medicalrecordsphotoURL,
      additionaldocuments:additionalFiles
  })
      setIsSaving(false);
      setIsSuccessfullyAdded(true);
      // Setting student form to init 
      setStudentForm(studentFormInit);
      console.log("SuccessFully Added");
      setTimeout(()=>{
        // Removing the alert from top after 2s
        setIsSuccessfullyAdded(false);
      },2000);
    }
  )
  .catch((err)=>{
    console.log(err);
  })
  };

  return (
    <div className="add-student-form container mt-2 w-100 ">
      {(isSuccessfullyAdded)?<div class="alert alert-success alert-dismissible fade show" role="alert">
  Successfully Addded
</div>:""}
      <div>
        <h2 className="text-center">Student Admission Form</h2>
      </div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {/* Student Photo */}
        <div className=" d-flex justify-content-center me-auto">
          <div>
            <img
              src={
                studentForm.studentphoto === "" ? emptyProfile : studentPhotoURL
              }
              alt="studentPicture "
              width={130}
            />
            <input
              className="ms-1"
              type="file"
              accept="image/*"
              name="studentphoto"
              id="student-photo"
              onChange={(e) => {
                handleChange(e);
              }}
              required
            />
          </div>
          <span className="required">*</span>
        </div>
        {/* Main Student Information */}
        <div className="row">
          <div className="d-flex flex-column col">
            <label htmlFor="first-name">
              First Name:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="first-name"
              name="firstname"
              value={studentForm.firstname}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>

          <div className="d-flex flex-column col">
            <label htmlFor="last-name">
              Last Name:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="last-name"
              name="lastname"
              value={studentForm.lastname}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
        </div>
        <div className="row">
          <div className="d-flex flex-column col">
            <label htmlFor="dob">
              Date of Birth:<span className="required">*</span>
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={studentForm.dob}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
          <div className="d-flex flex-column col">
            <label htmlFor="gender">
              Gender:<span className="required">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={studentForm.gender}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-column ">
          <label htmlFor="address">
            Address:<span className="required">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={studentForm.address}
            onChange={(e) => {
              handleChange(e);
            }}
            required
          ></input>
        </div>
        <div className="row">
          <div className="d-flex flex-column col">
            <label htmlFor="phone">
              Phone Number:<span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={studentForm.phone}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
          <div className="d-flex flex-column col">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={studentForm.email}
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
          </div>
          <div className="d-flex flex-column col">
            <label htmlFor="cnic">
              CNIC/B-Form:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="cnic"
              name="cnic"
              pattern="[0-9]{5}-[0-9]{7}-[0-9]"
              value={studentForm.cnic}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
        </div>
        {/* Parent/gaurdian information */}
        <div className="mt-2">
          <h3 className="text-center">Parent/Guardian Contact Form</h3>
          <div className="row">
            <div className="d-flex flex-column col">
              <label htmlFor="parent-name">
                Name:<span className="required">*</span>
              </label>
              <input
                type="text"
                id="parent-name"
                name="parentname"
                value={studentForm.parentname}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>
            <div className="d-flex flex-column col">
              <label htmlFor="parent-phone">
                Phone Number:<span className="required">*</span>
              </label>
              <input
                type="tel"
                id="parent-phone"
                name="parentphone"
                value={studentForm.parentphone}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>
          </div>
          <div className="row">
            <div className="d-flex flex-column col">
              <label htmlFor="parent-email">Email:</label>
              <input
                type="email"
                id="parent-email"
                name="parentemail"
                value={studentForm.parentemail}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></input>
            </div>
            <div className="d-flex flex-column col">
              <label htmlFor="parentcnic">
                Parent CNIC:<span className="required">*</span>
              </label>
              <input
                type="text"
                id="parentcnic"
                name="parentcnic"
                pattern="[0-9]{5}-[0-9]{7}-[0-9]"
                value={studentForm.parentcnic}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>
          </div>
        </div>
        {/* Enrollment Form */}
        <div className="mt-2">
          <h3 className="text-center">Enrollment Form</h3>
          <div className="row">
            <div className="d-flex flex-column col">
              <label htmlFor="courses">Select Course</label>
              <select name="courses" id="courses" onChange={(e)=>{handleChange(e)}}>
                <option value="">Select Course</option>
                <option value="fgdfgdf">DLD CC101</option>
                <option value="fgdfgdf">DSA CC102</option>
                <option value="fgdfgdf">DLD CC103</option>
              </select>
            </div>
            <div className="d-flex flex-column col">
              <label htmlFor="init_fees">
                Fees:<span className="required">*</span>
              </label>
              <input
                type="number"
                id="init_fees"
                name="initfees"
                value={studentForm.fees}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>
          </div>
        </div>
        {/* Emergency Contact Section */}
        <div className="mt-2">
          <h3 className="text-center">Emergency Contact Form</h3>
          <div className="row">
            <div className="d-flex flex-column col">
              <label htmlFor="emergency-name">
                Name:<span className="required">*</span>
              </label>
              <input
                type="text"
                id="emergency-name"
                name="emergencyname"
                value={studentForm.emergencyname}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>
            <div className="d-flex flex-column col">
              <label htmlFor="emergency-relationship">
                Relationship:<span className="required">*</span>
              </label>
              <input
                type="text"
                id="emergency-relationship"
                name="emergencyrelationship"
                value={studentForm.emergencyrelationship}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>
            <div className="d-flex flex-column col">
              <label htmlFor="emergency-phone">
                Phone Number: <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="emergency-phone"
                name="emergencyphone"
                value={studentForm.emergencyphone}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>
          </div>
        </div>
                
        {/* Previous School Form */}
        <div className="mt-2">
          <h3 className="text-center">Previous School Form</h3>
          <div className="row">
            <div className="d-flex flex-column col">
              <label htmlFor="previous-school-name">Name:</label>
              <input
                type="text"
                id="previous-school-name"
                name="previousschoolname"
                value={studentForm.previousschoolname}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></input>
            </div>
            <div className="d-flex flex-column col">
              <label htmlFor="previous-school-address">Address:</label>
              <input
                type="text"
                id="previous-school-address"
                name="previousschooladdress"
                value={studentForm.previousschooladdress}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></input>
            </div>
          </div>
        </div>
        {/* Related Documents */}
        <div className="mt-1">
          <h3 className="text-center">Related Documents</h3>
          <div className="row">
            <div className="col">
              <label htmlFor="studentcnic">
                CNIC/B-Form:<span className="required">*</span>
              </label>
              <input
                type="file"
                id="studentcnic"
                name="studentcnicphoto"
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>
            <div className="col">
              <label htmlFor="parentcnic">
                Parent CNIC:<span className="required">*</span>
              </label>
              <input
                type="file"
                id="parentcnic"
                name="parentcnicphoto"
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              ></input>
            </div>

            <div className="col">
              <label htmlFor="medical-records">Medical Records:</label>
              <input
                type="file"
                id="medical-records"
                name="medicalrecordsphoto"
                onChange={(e) => {
                  handleChange(e);
                }}
              ></input>
            </div>
          </div>
          <div className="row mt-1 text-center">
            <div className="col">
              <label htmlFor="additional-documents">
                Additional Documents:
              </label>
              <input
                type="file"
                id="additional-documents"
                name="additionaldocuments"
                onChange={(e) => {
                  handleChange(e);
                }}
                multiple
              ></input>
            </div>
          </div>
        </div>
        <div className="row mb-5 mt-3 ">
        <div className="d-flex justify-content-center ">
            {(isSaving)? <div className="spinner-border" role="status">
    <span className="visually-hidden">Saving...</span>
  </div>
:<button className=" btn-addstudent rounded col" type="submit" >
Save
</button>}
          
        </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;