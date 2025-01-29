let RoleManageArray

RoleManageArray = await fetch(route("checkRoleGetApi"), {method: "GET",}).then((response) => response.json()).then(data => {return data;});

export { RoleManageArray }