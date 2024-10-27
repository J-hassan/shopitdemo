export default (controllerFunc) => (req,res,next) => {

    return Promise.resolve(controllerFunc(req,res,next)).catch(next);

}