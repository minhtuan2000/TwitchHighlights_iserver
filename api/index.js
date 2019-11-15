module.exports = (req, res) => {
    res.sendFile('terms/terms.html', { root: __dirname });
}