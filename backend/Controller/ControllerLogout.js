exports.Logout = (req,res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    })
    res.status(200).json({ message: 'Sessão encerrada com sucesso!'})
    
}