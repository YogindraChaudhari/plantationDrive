import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const AttendancePage = () => {
  const { currentUser, userData } = useAuth();
  const [workType, setWorkType] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const workTypes = [
    "झाडांना पाणी देणे",
    "आळ तयार करणे",
    "ग्रीन नेट बांधणे",
    "मोठे गवत कापणे",
    "माती भुसभुशीत करणे",
    "गांडूळ खत टाकणे",
    "व्हर्मी कंपोस्ट खत टाकणे",
    "झाडांची पाने धुणे",
    "कंपोस्ट खत तयार करणे",
    "गांडूळ खत तयार करणे",
    "पाण्याच्या टाक्या भरणे",
    "ग्रास कटिंग किंवा इतर मशीन दुरुस्त करणे",
    "झाडांचे व इतर परिसर सर्वेक्षण करणे",
    "साहित्य नोंदणी करणे",
    "हजेरी नोंद करणे",
    "झुकलेल्या झाडांना आधार देणे",
    "पाण्याचा निचरा करणे",
    "कीटक नाशके फवारणे",
    "झाडा जवळचे गवत कापणे",
    "झाडांची माहिती अद्ययावत करणे",
    "नवीन झाडे लावणे",
    "मेलेली झाडे बदलणे",
    "झाडांची संख्या अद्ययावत करणे",
    "झाडांना नंबर देणे",
    "नवीन पाईप टाकणे",
    "पाईप दुरुस्त करणे",
    "गार्डन तयार करणे",
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      const attendanceCollection = collection(db, "attendance");
      const snapshot = await getDocs(attendanceCollection);
      const records = snapshot.docs.map((doc) => doc.data());
      setAttendanceRecords(records);
    };
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    if (!currentUser || !userData) return;

    try {
      await addDoc(collection(db, "attendance"), {
        userId: currentUser.uid,
        firstname: userData.firstname,
        lastname: userData.lastname,
        zone: userData.zone,
        workType,
        date: Timestamp.now().toDate().toLocaleDateString(),
        time: Timestamp.now().toDate().toLocaleTimeString(),
      });

      setAttendanceRecords((prevRecords) => [
        ...prevRecords,
        {
          firstname: userData.firstname,
          lastname: userData.lastname,
          zone: userData.zone,
          workType,
          date: Timestamp.now().toDate().toLocaleDateString(),
          time: Timestamp.now().toDate().toLocaleTimeString(),
        },
      ]);

      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Attendance Page</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsPopupOpen(true)}
      >
        Check In
      </button>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2 className="text-xl my-4 ">Type of Work Performed</h2>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            >
              <option value="">Select Work Type</option>
              {workTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleCheckIn}
              disabled={!workType}
            >
              Submit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded ml-4"
              onClick={() => setIsPopupOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2 sm:table-cell">Firstname</th>
                <th className="border px-4 py-2 sm:table-cell">Lastname</th>
                <th className="border px-4 py-2">Zone</th>
                <th className="border px-4 py-2 md:table-cell">Type of Work</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 md:border-none"
                >
                  <td className="border px-4 py-2 md:hidden">{record.date}</td>
                  <td className="border px-4 py-2 md:hidden">{record.time}</td>
                  <td className="border px-4 py-2 sm:hidden">
                    {record.firstname}
                  </td>
                  <td className="border px-4 py-2 sm:hidden">
                    {record.lastname}
                  </td>
                  <td className="border px-4 py-2 md:hidden">{record.zone}</td>
                  <td className="border px-4 py-2 md:hidden">
                    {record.workType}
                  </td>
                  <td className="border px-4 py-2 hidden sm:table-cell">
                    {record.date}
                  </td>
                  <td className="border px-4 py-2 hidden sm:table-cell">
                    {record.time}
                  </td>
                  <td className="border px-4 py-2 hidden sm:table-cell">
                    {record.firstname}
                  </td>
                  <td className="border px-4 py-2 hidden sm:table-cell">
                    {record.lastname}
                  </td>
                  <td className="border px-4 py-2 hidden sm:table-cell">
                    {record.zone}
                  </td>
                  <td className="border px-4 py-2 hidden md:table-cell">
                    {record.workType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
