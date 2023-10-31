module.exports = function(req,res){
    return res.status(200).json({
        status:'success',
        message: 'Hello world'
    });       
}