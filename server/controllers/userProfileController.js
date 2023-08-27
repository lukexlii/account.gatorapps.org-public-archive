const User = require('../model/User');

const getProfileSection = async (req, res) => {
  const profileItems = [
    { id: "name", label: "Name", value: "Luke Li" },
    { id: "nickname", label: "Nickname", value: "Luke's Testing Nickname", update: { description: "Please enter your new nickname. Leave blank to clear your nickname.", postRoute: "/appApi/account/updateUserProfile" } },
    { id: "organizationalDomain", label: "Organizational Domain", value: "UFL.EDU" },
    { id: "organizationalID", label: "Organizational ID", value: "luke.li" },
    { id: "currentAffiliation", label: "Current Affiliation", value: "Verified", verification: { verified: true } },
    { id: "unverifiedTesting", label: "Unverified Demo", value: "Unverified", verification: { verified: false } }
  ];

  res.status(200).json({ profileItems: JSON.stringify(profileItems) });
}

const updateProfile = async (req, res) => {
}


module.exports = { getProfileSection, updateProfile }