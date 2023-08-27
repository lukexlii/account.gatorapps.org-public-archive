const getProfileSection = (req, res) => {
  try {
    const authedUser = req.userAuth.authedUser;

    const [id, domain] = authedUser.primaryEmail.split("@");

    const profileItems = [
      { id: "name", label: "Name", value: authedUser.firstName + " " + authedUser.lastName },
      { id: "nickname", label: "Nickname", value: authedUser.nickname, update: { description: "Please enter your new nickname. Leave blank to clear your nickname.", postRoute: "/userProfile/updateProfile" } },
      { id: "organizationalDomain", label: "Organizational Domain", value: domain.toUpperCase() },
      { id: "organizationalID", label: "Organizational ID", value: id },
      { id: "currentAffiliation", label: "Current Affiliation", value: "Verified", verification: { verified: true } },
      { id: "unverifiedTesting", label: "Unverified Demo", value: "Unverified", verification: { verified: false } }
    ];

    return res.status(200).json({ 'errCode': '0', profileItems: JSON.stringify(profileItems) });
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to get user profile' });
  }
}

const updateProfile = async (req, res) => {
  const profileField = req?.body?.payload?.id;
  const newValue = req?.body?.payload?.value;
  if (!profileField || !newValue) return res.status(400).json({ 'errCode': '-', 'errMsg': 'Missing required payload properties' });

  if (profileField !== 'nickname') return res.status(400).json({ 'errCode': '-', 'errMsg': 'Invalid profileField' });
  try {
    const authedUser = req.userAuth.authedUser;

    authedUser[profileField] = newValue.trim();
    await authedUser.save();

    return res.status(200).json({ 'errCode': '0' });
  } catch (err) {
    return res.status(500).json({ 'errCode': '-', 'errMsg': 'Unable to update user profile' });
  }
}

module.exports = { getProfileSection, updateProfile }