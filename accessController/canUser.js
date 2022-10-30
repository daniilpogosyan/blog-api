function canUser(user, action, resource) {
  // check if the user has a specific permission
  const canAct = user.permissions.includes(action);

  // if resource is provided then check if it belongs to the user
  const ownResource = resource ? user._id.equals(resource.author._id) : true;
  
  if (canAct && ownResource) return true;
  return false;
}

module.exports = canUser;
