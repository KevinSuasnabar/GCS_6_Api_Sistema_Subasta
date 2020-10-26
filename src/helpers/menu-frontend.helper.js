const getMenu = (role = 'USER_ROLE') => {
    switch (role) {
        case "CLIENT_ROLE":
            return "Acá llegará las funcionalidades de Cliente."
        case "SUPERVISOR_ROLE":
            return "Acá llegará las funcionalidades de Supervisor."
        case "ADMIN_ROLE":
            return "Acá llegará las funcionalidades de Administrador."
        default:
            return "ERROR"
    }
}

module.exports = {
    getMenu
}