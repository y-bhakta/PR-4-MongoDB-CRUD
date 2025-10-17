import { LocalStorage } from "node-localstorage"
global.localStorage = new LocalStorage('./scratch');
export const userMiddleware = (req, res, next) => {
    let userId = localStorage.getItem('id');
    if (userId === ""|| !userId) {
        return res.redirect('/login');
    }
    next();
}