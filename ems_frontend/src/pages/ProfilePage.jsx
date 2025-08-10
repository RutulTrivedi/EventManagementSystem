import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import CreatorHeader from "../components/CreatorHeader";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [passwordForUpdate, setPasswordForUpdate] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const expiry = localStorage.getItem("expiry");
        if (!expiry || Number(expiry) < Date.now()) {
            localStorage.removeItem("user");
            localStorage.removeItem("expiry");
            localStorage.removeItem("token");
            Swal.fire({
                    toast: true,
                    position: "bottom-end",
                    icon: "error",
                    title: "Session expired. Please login again.",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#ff0000",
                    color: "#ffffff"
                }).then(() => {
                navigate("/");
            });
            return;
        }

        // Load User
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            setEditFormData(storedUser);
        }
    }, [navigate]);

    const handleSaveClick = () => {
        setShowEditModal(false);
        setPasswordForUpdate("");
        setShowPasswordModal(true);
    };

    const verifyPasswordAndUpdate = async () => {
        try {
            // Step 1: Check password
            const checkRes = await fetch("http://localhost:5251/api/user/checkpassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userID: user.userID,
                    userPassword: passwordForUpdate
                })
            });

            const checkData = await checkRes.json();
            console.log(checkData);
            if (!checkData.success || !checkData.data) {
                Swal.fire({
                    toast: true,
                    position: "bottom-end",
                    icon: "error",
                    title: "Incorrect password.",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#ff0000",
                    color: "#ffffff"
                });
                setShowPasswordModal(false);
                return;
            }
            console.log(editFormData);

            editFormData.userPassword = passwordForUpdate;

            // Step 2: Update profile
            const updateRes = await fetch(`http://localhost:5251/api/user/${user.userID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editFormData)
            });

            // console.log(updateRes);
            // updateRes.userPassword = null;
            editFormData.userPassword = null;

            if (updateRes.ok) {
                localStorage.setItem("user", JSON.stringify(editFormData));
                setUser(editFormData);
                setShowPasswordModal(false);

                Swal.fire({
                    toast: true,
                    position: "bottom-end",
                    icon: "success",
                    title: "Profile updated successfully.",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#008000",
                    color: "#ffffff"
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) {
        return <p className="p-6">Loading profile...</p>;
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            <CreatorHeader />
            <main className="p-6 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-[#27548A] mb-4">My Profile</h2>

                <div className="bg-white p-6 rounded-lg shadow space-y-3">
                    <p><b>Full Name:</b> {user.userFullName}</p>
                    <p><b>Email:</b> {user.userEmail}</p>
                    <p><b>Mobile:</b> {user.userMobile}</p>
                    <p><b>Role:</b> {user.userRole}</p>
                </div>

                <div className="mt-4">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                </div>
            </main>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-8 w-[800px] max-w-3xl">
                        <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleSaveClick(); }} className="space-y-4">

                            {/* Editable Fields */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editFormData.userFullName || ""}
                                    onChange={(e) => setEditFormData({ ...editFormData, userFullName: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editFormData.userEmail || ""}
                                    onChange={(e) => setEditFormData({ ...editFormData, userEmail: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Mobile</label>
                                <input
                                    type="text"
                                    value={editFormData.userMobile || ""}
                                    onChange={(e) => setEditFormData({ ...editFormData, userMobile: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                />
                            </div>

                            {/* Readonly Role */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Role</label>
                                <input
                                    type="text"
                                    value={editFormData.userRole || ""}
                                    readOnly
                                    className="w-full border rounded p-4 text-lg bg-gray-100"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Confirmation Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">Confirm Update</h3>
                        <p>Please enter your password to confirm changes.</p>
                        <input
                            type="password"
                            value={passwordForUpdate}
                            onChange={(e) => setPasswordForUpdate(e.target.value)}
                            className="w-full border rounded p-3 text-lg mt-3"
                            required
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={verifyPasswordAndUpdate}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;