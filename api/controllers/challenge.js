import mongoose from 'mongoose';
import {getUser} from './util';
let Challenge = mongoose.model('Challenge');

const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};

export function challengeRetrieveList(req, res) {
    getUser(req, res, (req, res, user) => {
        Challenge
            .find({})
            .populate('comments._creator')
            .populate('comments.comments._creator')
            .exec((err, challenges) => {
                if (err) {
                    sendJSONresponse(res, 400, err);
                    return;
                }
                sendJSONresponse(res, 200, challenges.slice(0, user.level));
                return;
            });
    })
};

export function challengeRetrieveOne(req, res) {
    if (!req.params.challengeId) {
        sendJSONresponse(res, 404, {
            message: "No challengeId in the request"
        });
        return;
    }
    Challenge
        .findById(req.params.challengeId)
        .populate('comments._creator')
        .populate('comments.comments._creator')
        .exec((err, challenge) => {
            if (err) {
                sendJSONresponse(res, 400, err);
                return;
            }
            if (!challenge) {
                sendJSONresponse(res, 404, {
                    message: "Challenge not found"
                });
                return;
            }
            sendJSONresponse(res, 200, challenge);
            return;
        })
};

export function challengeCreate(req, res) {
    Challenge.create({
        title: req.body.title,
        description: req.body.description,
        videoUrl: req.body.videoUrl
    }, (err, challenge) => {
        if (err) {
            sendJSONresponse(res, 400, err);
            return;
        }
        sendJSONresponse(res, 201, challenge);
        return;
    });
};

export function challengeModify(req, res) {
    if (!req.params.challengeId) {
        sendJSONresponse(res, 404, {
            message: "No challengeId in the request"
        });
        return;
    }
    Challenge
        .findById(req.params.challengeId)
        .exec((err, challenge) => {
            if (req.body.title) {
                challenge.title = req.body.title;
            }
            if (req.body.description) {
                challenge.description = req.body.description;
            }
            if (req.body.videoUrl) {
                challenge.videoUrl = req.body.videoUrl;
            }
            challenge.save((err, challenge) => {
                if (err) {
                    sendJSONresponse(res, 404, err);
                    return;
                }
                sendJSONresponse(res, 200, challenge);
                return;
            });
        });
};

export function challengeDestroy(req, res) {
    // if (!req.params.challengeId) {
    //     sendJSONresponse(res, 404, {
    //         message: 'No challengeId in the request'
    //     });
    //     return;
    // }
    Challenge
        .findByIdAndRemove(req.params.challengeId)
        .exec((err, challenge) => {
            if (err) {
                sendJSONresponse(res, 404, err);
                return;
            }
            sendJSONresponse(res, 204, null);
        });
};