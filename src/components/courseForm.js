import React from "react";
import "../LowerStaff.css";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"
import { db } from "../firebase/config";
import { useState } from "react";

const courseFormForm = {
  courseTitle: "",
  courseDesc: "",
  courseOutline: "",
  courseInstructor: "",
  courseDuration: "",
  courseStartDate: "",
  courseEndDate: "",
  courseVideo: [],
};
const CourseFormData = () => {
  const [courseForm, setcourseForm] = useState(courseFormForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false);
  
  
  const handleChange = (e) => {
    if (e.target.name === "courseVideo") {
        setcourseForm({ ...courseForm, [e.target.name]: e.target.files });
    }
    else {
        setcourseForm({ ...courseForm, [e.target.name]: e.target.value });
    }
  };


  const handleSubmit =async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Create a courseInstructor to the courseForm collection
    const courseFormRef = db.collection("courseForm");
    const { courseVideo} = courseForm;
    const courseFormTextForm=courseForm;
    // Create a storage courseInstructor
    const storageRef =  firebase.storage().ref();

     
  await courseFormRef.add(courseFormTextForm).then(
    async(doc)=>{
      
    //Upload the files
    let additionalFiles=[];
    if (courseVideo) {
      for (var i = 0; i < courseVideo.length; i++) {
        const courseVideoSnapshot = await storageRef.child(`students/${doc.id}/additionaldocument${i+1}`).put(courseVideo[i]);
          additionalFiles.push(await courseVideoSnapshot.ref.getDownloadURL());
    }
      
  }

     // update the document with the file URLs
     await courseFormRef.doc(doc.id).update({
      courseVideo:additionalFiles
  })
      setIsSaving(false);
      setIsSuccessfullyAdded(true);
      // Setting courseForm form to init 
      setcourseForm(courseFormForm);
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
        <h2 className="text-center">Add Course Form</h2>
      </div>
      <form onSubmit={(e) => {handleSubmit(e);}}>
        
        {/* Main courseForm Information */}
        <div className="row mt-4">
          <div className="d-flex flex-column col">
            <label htmlFor="courseTitle">
              Course Title:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="courseTitle"
              name="courseTitle"
              value={courseForm.courseTitle}
              placeholder='Mern Stack Developer'
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>

          <div className="d-flex flex-column col">
            <label htmlFor="last-name">
              Course Instructor:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="courseInstructor"
              name="courseInstructor"
              placeholder='John Doe'
              value={courseForm.courseInstructor}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
        </div>
        <div className="row mt-2">
          <div className="d-flex flex-column col">
            <label htmlFor="courseStartDate">
              Course Start Date:<span className="required">*</span>
            </label>
            <input
              type="date"
              id="courseStartDate"
              name="courseStartDate"
              value={courseForm.courseStartDate}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
          <div className="d-flex flex-column col">
            <label htmlFor="courseStartDate">
              Course End Date:<span className="required">*</span>
            </label>
            <input
              type="date"
              id="courseEndDate"
              name="courseEndDate"
              value={courseForm.courseEndDate}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
              required
            ></input>
          </div>
          <div className="d-flex flex-column col">
            <label htmlFor="courseDuration">
                courseDuration:<span className="required">*</span>
            </label>
            <input
              type="text"
              id="courseDuration"
              name="courseDuration"
              placeholder="6 Months"
              value={courseForm.courseDuration}
              className='px-2'
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
          </div>
        </div>

        <div className="d-flex flex-column mt-2">
          <label htmlFor="courseDesc">
            Course Desc:<span className="required">*</span>
          </label>

          <textarea 
            type="text"
            id="courseDesc"
            name="courseDesc"
            className="px-2" 
            placeholder='Course Desc'
            value={courseForm.courseDesc}
            rows="3"
            onChange={(e) => {
              handleChange(e);
            }}
            required
            ></textarea>

        </div>

        <div className="d-flex flex-column mt-2">
          <label htmlFor="courseOutline">
            Course Outline:<span className="required">*</span>
          </label>
          <textarea 
            type="text"
            id="courseOutline"
            name="courseOutline"
            className="px-2" 
            placeholder='Course Outline'
            value={courseForm.courseOutline}
            rows="3"
            onChange={(e) => {
              handleChange(e);
            }}
            required
            ></textarea>
        </div>

        {/* Related Documents */}
          <div className="row mt-2 text-center">
            <div className="col">
              <label htmlFor="courseVideo">
                Course Video:
              </label>
              <input
                type="file"
                id="courseVideo"
                name="courseVideo"
                className='px-2'
                onChange={(e) => {
                  handleChange(e);
                }}
                multiple
              ></input>
            </div>
          </div>
        <div className="row mb-5 mt-3 ">
        <div className="d-flex justify-content-center ">
            {(isSaving)? <div className="spinner-border" role="status">
    <span className="visually-hidden">Saving...</span>
  </div>
:<button className=" btn-addstudent py-2 rounded col" type="submit" >
Save
</button>}
          
        </div>
        </div>
      </form>
    </div>
  );
};

export default CourseFormData;