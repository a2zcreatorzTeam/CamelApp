import React, { Component, } from "react";
import FormData from "form-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import camelapp from "../api/camelapp";
export const DataContext = React.createContext();
export default class Provider extends Component {


    constructor(props) {
        super(props);

        this.state = {
            user: {},
            posts: [],
            profile: {},
            userPosts: {},
            competitionList: {},
            surveyList: {},
            camelFemaleList: {},
            camelMovingList: {},
            camelMissingList: {},
            camelEquipmentList: {},
            camelFoodList: {},
            camelSellingList: {},
            camelClubList: {},
            camelTreatmentList: {},
            camelMarketingList: {},
            flageForUserPosts: false,
            getMessages: {},
            getUserDropList: {},
            followerList: [],
            followingList: [],
            aboutUS: {},
            sponsors: {},
            bank: {},
            privacyPolicy: {},
            competitionWinner: {},
            postsOfBid: [],
        };

    }

    componentDidMount() {

        this.viewPost();
        this.viewCompetitionList();
        this.getNewsList();
        this.getSurveyList();
        this.getFemaleCamelList();
        this.getCamelMoving();
        this.getCamelMissing();
        this.getCamelFood();
        this.getCamelEquipment();
        this.getCamelMarketing();
        this.getCamelSelling();
        this.getCamelClub();
        this.getTreatmentList();
        this.getAboutUs();
        this.getPrivacyPolicy();
        this.getBank();
        this.getSponsors();

        AsyncStorage.getItem("user").then((response) => {
            if (response != null) {
                let user = null;
                user = JSON.parse(response);
                this.viewProfile(user.id, user.id);
                this.getMessage(user.id);
                this.getUserDropDown(user.id);
                this.fetchUser(user.id);
                this.getFollowerList(user.id);
                this.getFollowingList(user.id);
                this.getBids(user.id);
                this.getPostOfBids(user.id)

            }
        })
    }

    setUser = async (user) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));

        } catch (error) {
            //console.log(error);
        }
    };

    getUser = async () => {
        return await AsyncStorage.getItem("user");
    };


    setUserCheckIn = async (status) => {


        try {
            await AsyncStorage.setItem("user_check_in", JSON.stringify(status));

        } catch (error) {
            //console.log(error);
        }
    };

    getUserCheckIn = async () => {
        return await AsyncStorage.getItem("user_check_in");
    };


    createPostCamelClub = async (user_id, title, location, description, image) => {
        let res = null;
        try {
            return await camelapp.post("/add/post",
                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image,
                }
            ).then((response) => {
                //console.log("response of createPost Camel Club", response.data);
                res = response.data;
                return res;
            })
        } catch (error) {
            //console.log("error at create post camel club", error.response)
        }
    };
    createPostCamelClubb = async (user_id, title, location, description, image, video) => {
        let res = null;
        try {
            return await camelapp.post("/add/postclub",
                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image,
                    video: video,
                }
            ).then((response) => {
                //console.log("response of createPost Camel Club", response.data);
                res = response.data;
                return res;
            })
        } catch (error) {
            //console.log("error at create post camel club", error.response)
        }
    };
    createPostCamelClub = async (user_id, title, location, description, image) => {
        let res = null;
        try {
            return await camelapp.post("/add/post",
                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image
                }
            ).then((response) => {
                //console.log("response of createPost Camel Club", response.data);
                res = response.data;
                return res;
            })
        } catch (error) {
            //console.log("error at create post camel club", error.response)
        }
    };

    // this.state.title,
    //             this.state.color,
    //             this.state.camel_type,
    //             this.state.location,
    //             this.state.description,
    //             this.state.image

    createPostTreatingCamels = async (user_id,
        title,
        camel_color,
        camel_type,
        location,
        description,
        image,
    ) => {

        let response = null;

        try {


            return await camelapp.post("/add/treatment",
                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image,
                    camel_type: camel_type,
                    color: camel_color

                }
            ).then((res) => {

                //console.log("response of createPost posts", res.data)

                response = res.data;
                return response;

            })
        } catch (error) {

            //console.log("error", error.response)

        }
    }

    createPostMissingingCamels = async (
        user_id,
        title,
        camel_color,
        camel_type,
        location,
        description,
        image,
    ) => {

        let response = null;

        try {

            return await camelapp.post("/add/missing",
                {
                    user_id: user_id,
                    title: title,
                    color: camel_color,
                    camel_type: camel_type,
                    location: location,
                    description: description,
                    images: image,

                }
            ).then((res) => {

                //console.log("response of createPost posts", res.data)

                response = res.data;
                return response;

            })
        } catch (error) {

            //console.log("error", error.response)

        }
    };


    createPostSellingCamel = async (
        user_id,
        title,
        location,
        description,
        image,
        camel_type,
        camel_color,
        price,
        price_type,
        commission,
        register) => {

        let res = null;
        try {

            return await camelapp.post("/add/selling",

                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image,
                    camel_type: camel_type,
                    color: camel_color,
                    price: price,
                    price_type: price_type,
                    commission: commission,
                    register: register,

                }
            ).then((response) => {

                //console.log("response of createPost posts", response.data)
                res = response;
                return res;
            })
        } catch (error) {
            //console.log("error", error)

        }
    };

    createPostCamelEquipment = async (
        user_id,
        title,
        location,
        description,
        image,
        camel_type,
        camel_color,
        price,
        price_type,
        register) => {
        let res = null;
        try {

            return await camelapp.post("/add/equipment",

                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image,
                    camel_type: camel_type,
                    color: camel_color,
                    price: price,
                    price_type: price_type,
                    register: register,

                }
            ).then((response) => {

                //console.log("response of createPost posts", response.data)
                res = response;
                return res;
            })
        } catch (error) {
            //console.log("error", error)

        }
    };

    createPostCamelFood = async (
        user_id,
        title,
        location,
        description,
        image,
        camel_type,
        camel_color,
        price,
        price_type,
        register) => {
        let res = null;
        try {

            return await camelapp.post("/add/food",

                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image,
                    camel_type: camel_type,
                    color: camel_color,
                    price: price,
                    price_type: price_type,
                    register: register,

                }
            ).then((response) => {

                //console.log("response of createPost posts", response.data)
                res = response;
                return res;
            })
        } catch (error) {
            //console.log("error", error)

        }
    };

    createPostLiveMarketing = async (
        user_id,
        title,
        location,
        description,
        price,
        image
    ) => {

        let res = null;
        try {


            return await camelapp.post("/add/marketing",
                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    price: price,
                    description: description,
                    images: image,

                }

            ).then((response) => {

                //console.log("response of createPost posts", response.data)
                res = response.data;
                return res;
            })
        } catch (error) {
            //console.log("error", error.response)

        }
    };
    createPostBeautyCompetition = async (user_id, competition_id, title, location, description,
        image, age) => {

        try {

            return await camelapp.post("/add/competition",
                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image,
                    competition_id: competition_id,
                    age: age
                }
            ).then((response) => {

                //console.log("response of createPost posts", response.data)
                // res = response;
                // return res;
            })
        } catch (error) {
            //console.log("error at beauty competition ", error.response)

        }
    };




    viewCompetitionList = async () => {

        try {

            return await camelapp.get("/get/competition"
            ).then((response) => {

                this.setState({ competitionList: response.data.status })
                //console.log("response of viewCompetionList", response.data.status)
            })
        } catch (error) {

            //console.log("error at competition list", error)

        }
    };

    viewProfile = async (user_id, current_user_id) => {

        try {

            return await camelapp.post("/profile",
                {
                    user_id: user_id,
                    current_user_id: current_user_id
                }
            ).then((response) => {


                if (response.data.status != false) {

                    //console.log("response", response)

                    this.setState({ flageForUserPosts: true })
                    let tempPost = response.data.posts.length;
                    // //console.log("length of post array", tempPost)
                    let array = [];
                    for (let i = 0; i < tempPost; i++) {
                        array.push(response.data.posts[i].post)
                    }

                    //console.log("array of user posts", array)
                    this.setState(
                        { userPosts: array }
                    )

                    this.fetchUser(user_id);
                    //console.log("array of user posts from state", this.state.userPosts);
                    // //console.log("array of user  from state", this.state.user);
                } else {



                    AsyncStorage.removeItem('user');
                    AsyncStorage.removeItem('user_check_in');
                }



            })
        } catch (error) {

        }
    };

    getNewsList = async () => {

        try {

            return await camelapp.get("/get/news").then((response) => {

                this.setState({ newsList: response.data.news })


                //console.log("response from news", response.data.news)


            })
        } catch (error) {

        }
    };
    getPostOfBids = async (user_id) => {

        try {

            return await camelapp.get("/getPostByCategories/" + user_id).then((response) => {

                this.setState({ postsOfBid: response.data.status })


                //console.log("response from get post bids", response.data.status)


            })
        } catch (error) {

        }
    };


    getAboutUs = async () => {

        try {

            return await camelapp.get("/getAbout").then((response) => {

                this.setState({ aboutUS: response.data.data[0].details })


                //console.log("response from about us", response.data.data[0].details)


            })
        } catch (error) {

        }
    };
    getPrivacyPolicy = async () => {

        try {

            return await camelapp.get("/getprivacies").then((response) => {


                const regex = /<[^>]*>/mgi;
                // const regex = /[\xc2\xa0]+/g;
                const text = response.data.data[0].description;
                // const text_two = text.replace(regex, "")
                const text_without_tags = text.replace(regex, "")

                this.setState({ privacyPolicy: text_without_tags })

                //console.log("response from privacy policy", text_without_tags)


            })
        } catch (error) {

        }
    };


    getSponsors = async () => {

        try {

            return await camelapp.get("/getSponsars").then((response) => {


                this.setState({ sponsors: response.data.data })


                //console.log("response from sponsors", response.data.data)


            })
        } catch (error) {

        }
    };
    getBank = async () => {

        try {

            return await camelapp.get("/getBank").then((response) => {

                this.setState({ bank: response.data.status })


                //console.log("response from bank", response.data.status)


            })
        } catch (error) {

            //console.log("error", error)

        }
    };


    getBids = async (user_id) => {

        //console.log("bids started")

        try {

            return await camelapp.post("/get/bids",
                {
                    user_id: user_id
                }).then((response) => {

                    this.setState({ bidsList: response.data.bids })


                    //console.log("response from get bids", response.data.bids)


                })
        } catch (error) {

        }
    };
    getFollowerList = async (user_id) => {

        try {

            return await camelapp.post("/get/follower",
                {
                    user_id: user_id
                }
            ).then((response) => {

                this.setState({ followerList: response.data.followers })


                //console.log("---- followers", response.data)


            })
        } catch (error) {

        }
    };
    deletePost = async (post_id) => {
        try {
            return await camelapp.post("delete/post",
                {
                    post_id: post_id
                }
            ).then((response) => {
                //console.log("---- delete post", response);
            })
        } catch (error) {
            //console.log("Error at delete Post---", error);
        }
    };
    getFollowingList = async (user_id) => {

        try {
            return await camelapp.post("/get/following",
                {
                    user_id: user_id
                }
            ).then((response) => {
                this.setState({ followingList: response.data.followings });
                //console.log("following -----", response.data.followings);
            })
        } catch (error) {

        }
    };

    getSurveyList = async () => {

        try {

            return await camelapp.get("/get/survey").then((response) => {

                this.setState({ surveyList: response.data })


                //console.log("response from survey", response.data)


            })
        } catch (error) {

        }
    };


    createPostCamelFemale = async (user_id, title, location, description, image, camel_type, camel_color) => {
        let res = null;
        try {



            return await camelapp.post("/add/camel_female",
                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: image,
                    type: camel_type,
                    color: camel_color

                }

            ).then((response) => {

                //console.log("response of createPost posts", response.data)

                res = response.data;

                return res;

            })
        } catch (error) {

            //console.log("error", error.response)

        }
    };

    createPostMovingCamel = async (
        user_id,
        title,
        location,
        description,
        images,
        register,
        account_activity,
        car_model,
        car_type,
        price,
        to_location
    ) => {
        let res = null;
        try {

            // "user_id"=>"required",
            // "first_name"=>"required",
            // "car"=>"required",
            // "type"=>"required",
            // "to"=>"required",
            // "from"=>"required",
            // "description"=>"required",
            // "price"=>"required",
            // "images"=>"required",

            return await camelapp.post("/add/camel_moving",
                {
                    user_id: user_id,
                    title: title,
                    location: location,
                    description: description,
                    images: images,
                    register: register,
                    account_activity: account_activity,
                    car_model: car_model,
                    car_type: car_type,
                    price: price,
                    to_location: to_location,


                }

            ).then((response) => {

                //console.log("response of createPost posts", response.data)
                res = response;

                return res;


            })
        } catch (error) {

            //console.log("error", error.response)

        }
    };

    // logging in user
    signInUser = async (phone, password) => {

        var response = null;
        try {


            //console.log("Signing in started---");

            return await camelapp
                .post(
                    "/login",
                    {
                        phone: phone,
                        password: password
                    }
                )
                .then((res) => {


                    response = res.data;

                    //console.log("response", res.data)

                    if (response.status == true) {
                        this.setUser(response.user);
                        this.setUserCheckIn("already_logged_in");
                        this.setState({
                            user: response.user,
                            profile: res.data,
                            flageForUserPosts: response.status,
                        });
                        this.viewProfile(response.user.id, response.user.id)
                        this.getMessage(response.user.id)

                        this.getUserDropDown(response.user.id);

                    }

                    return response;
                });

        } catch (error) {


            //console.log("Error Message--- signin", error);
        }
    };




    getUserDropDown = async (user_id) => {
        let response = null;
        try {
            return await camelapp.get("/get/userDropdown/" + user_id
            ).then((res) => {
                //console.log("response User drop down list", res);
                response = res.data;
                //console.log("response User drop down list", response);
                this.setState({ getUserDropList: response })
                return response;
            })
        } catch (error) {
            //console.log("get Drop Down error", error.response)
        }
    };


    updateProfile = async (user_id, name, image) => {

        try {
            var response = null;
            return await camelapp
                .post(
                    "/update",
                    {
                        user_id: user_id,
                        name: name,
                        image: image
                    }
                )
                .then((res) => {

                    //console.log("response", res)

                    this.fetchUser(user_id)

                    response = res;

                    return response;

                });



        } catch (error) {

            //console.log("Error Message--- update profile", error.response);
            return null;
        }

    };


    viewPost = async (id) => {
        try {

            return await camelapp
                .get(
                    "/view/post"
                )
                .then((res) => {
                    //console.log("response of view posts", res.data.Posts)
                    this.setState({
                        posts: res.data.Posts,
                        // user: res.data
                    })
                });
        } catch (error) {
            //console.log("Error Message--- view post", error.response);

        }

    };


    submitSurvey = async (user_id, survey_id, answer) => {

        var response = null;
        try {




            const formData = new FormData();
            formData.append("user_id", user_id);
            formData.append("survey_id", survey_id);
            formData.append("answer", answer)
            return await camelapp
                .post(
                    "/add/survey",
                    formData

                )
                .then((res) => {
                    //console.log("response at submitSurvey", res.data)

                    response = res.data;
                    return response;
                });

        } catch (error) {
            //console.log("error submit survey", error.response);
            return null;
        }
    };

    getFemaleCamelList = async () => {

        try {




            return await camelapp.get("/get/camel_female",

            ).then((res) => {

                //console.log("response at get camel female list", res.data.Posts);

                this.setState({ camelFemaleList: res.data.Posts })


            })
        } catch (error) {

            //console.log("error comments list", error.response)

        }
    };

    getTreatmentList = async () => {

        try {




            return await camelapp.get("/get/camel_teatment",

            ).then((res) => {

                //console.log("response at get camel treatment list", res.data.Posts);

                this.setState({ camelTreatmentList: res.data.Posts })


            })
        } catch (error) {

            //console.log("error treatment list", error.response)

        }
    };


    getCamelMoving = async () => {

        try {




            return await camelapp.get("/get/camelmove",

            ).then((res) => {

                //console.log("response at get camel moving list", res.data.Posts);

                this.setState({ camelMovingList: res.data.Posts })


            })
        } catch (error) {

            //console.log("error moving list", error.response)

        }
    };

    getCamelMarketing = async () => {

        try {




            return await camelapp.get("/get/marketing",

            ).then((res) => {

                //console.log("response at get camel marketing list", res.data.Posts);

                this.setState({ camelMarketingList: res.data.Posts })


            })
        } catch (error) {

            //console.log("error marketing list", error.response)

        }
    };
    getCamelClub = async () => {

        try {




            return await camelapp.get("/postclub").then((res) => {

                //console.log("response at get camel Club list", res.data.Posts);

                this.setState({ camelClubList: res.data.Posts })


            })
        } catch (error) {

            //console.log("errorat get camel Club list", error.response)

        }
    };

    getCamelMissing = async () => {

        try {




            return await camelapp.get("/get/camel_missing",

            ).then((res) => {

                //console.log("response at get camel Missing list", res.data.Posts);

                this.setState({ camelMissingList: res.data.Posts })


            })
        } catch (error) {

            //console.log("error comments list", error.response)

        }
    };

    getCamelEquipment = async () => {

        try {




            return await camelapp.post("/get/camel_equipment",

            ).then((res) => {

                //console.log("response at get camel equipment list", res.data.Posts);

                this.setState({ camelEquipmentList: res.data.Posts })


            })
        } catch (error) {

            //console.log("error equipment list", error.response)

        }
    };

    getCamelSelling = async () => {

        try {
            return await camelapp.get("/get/camel_selling",

            ).then((res) => {

                //console.log("response at get camel selling list", res.data.Posts);

                this.setState({ camelSellingList: res.data.Posts })


            })
        } catch (error) {

            //console.log("error selling list", error.response)

        }
    };

    //

    getCamelFood = async () => {

        try {




            return await camelapp.get("/get/camel_food",

            ).then((res) => {

                //console.log("response at get camel food list", res.data.Posts);

                this.setState({ camelFoodList: res.data.Posts })


            })
        } catch (error) {

            //console.log("error camel food list", error.response)

        }
    };
    fetchUser = async (user_id) => {

        try {
            return await camelapp.get("/get/fetchUser/" + user_id).then((res) => {

                //console.log("response at fetch", res.data);

                this.setState({ profile: res.data });
                this.setUser(res.data.user);



            })
        } catch (error) {

            //console.log("error at fetch user", error.response)

        }
    };

    getCommentsOnPost = async (post_id) => {

        let response = null;
        try {

            //console.log("post_id at Data context", post_id)

            const formData = new FormData();
            formData.append("post_id", post_id);

            return await camelapp.post("/get/comment",
                {
                    post_id: post_id,
                }
            ).then((res) => {

                //console.log("response", res.data);


                response = res.data;

                //console.log("res", response)
                return response;

            })
        } catch (error) {

            //console.log("error comments list", error.response)

        }
    };
    getCompetitionDetails = async (competition_id) => {

        let response = null;
        try {

            // //console.log("post_id at Data context", post_id)

            return await camelapp.post("get/competition_details",
                {
                    competition_id: competition_id
                }
            ).then((res) => {

                //console.log("response at comepetition details", res.data);


                response = res.data;

                //console.log("res", response)
                return response;

            })
        } catch (error) {

            //console.log("error at competition details", error.response)

        }
    };
    getMessage = async (user_id) => {

        let response = null;
        try {
            //console.log("get message data", user_id)
            return await camelapp.get("/getmsg/" + user_id).then((res) => {
                //console.log("response Get Message", res);
                response = res.data;
                this.setState({ getMessages: response });
                return response;
            })
        } catch (error) {
            //console.log("get message error", error.response);
        }
    };


    sendMessage = async (sender_id, reciever_id, message) => {
        let res = null;
        try {
            await camelapp.post("/sendmsg",
                {
                    sender_id: sender_id,
                    reciever_id: reciever_id,
                    message: message
                }
            ).then((response) => {
                //console.log(response, 'send message response')
                res = response.data;
                return res;
            })
        }
        catch (error) {
            //console.log(error, 'Error of send message API')
        }

    }
    checkBid = async (user_id, post_id) => {

        try {

            return await camelapp.post("/checkBid",
                {
                    user_id: user_id,
                    post_id: post_id
                }
            ).then((response) => { 
                let res = null;
                // //console.log('check bid', response)
                res = response.data;
                return res;
            })
        }
        catch (error) {
            //console.log('error in check bid', error.res)
        }

    }

    followRequest = async (user_id, follower_id) => {

        let res = null;
        try {

            return await camelapp.post("/follow",
                {
                    user_id: user_id,
                    follower_id: follower_id,
                }
            ).then((response) => {
                // //console.log(response, 'follow  response')
                res = response.data;
                return res;
            })
        }
        catch (error) {
            //console.log(error.response, 'Error of follow API')
        }

    }
    addnewCommentNews = async (user_id, news_id, comment) => {

        let res = null;
        try {


            return await camelapp.post("/add/news/comment",
                {
                    user_id: user_id,
                    news_id: news_id,
                    comment: comment

                }
            ).then((response) => {
                //console.log("response", response.data);
                res = response.data;
                return res;
            })
        } catch (error) {
            //console.log("error at news comment api", error.response)

        }
    }
    placeBid = async (user_id, post_id, price) => {

        let res = null;
        try {

            return await camelapp.post("/add/bid",
                {
                    user_id: user_id,
                    post_id: post_id,
                    price: price

                }
            ).then((response) => {
                //console.log("response", response.data);
                res = response.data;
                return res;
            })
        } catch (error) {
            //console.log("error at place bid api", error.response)

        }
    }

    bidPosts = async () => {
        let res = null;
        try {
            return await camelapp.get("/getPostByCategories").then((response) => {
                //console.log("response bidPosts", response.data);
                res = response.data;
                return res;
            })
        } catch (error) {
            //console.log("error at bidPosts api", error.response)
        }
    }

     deletePost = async (post_id) => {
        let res = null;
    
        try {
    
            return await camelapp.post("delete/post",
                {
                    post_id: post_id
                }
            ).then((response) => {
    
    
    
                //console.log("---- delete post", response)
                res = response.data;
                return res;
    
            })
        } catch (error) {
            //console.log("Error at delete Post---", error)
        }
    };

    signUpUser = async (name, phone, password) => {
        let res = null;
        try {
            return await camelapp.post("/register", {

                name: name,
                phone: phone,
                password: password

            }).then((response) => {
                //console.log("response signup", response.data);

                res = response.data;

                if (response.data.id) {

                    let user = response.data;
                    // user = JSON.parse(response);
                    this.viewProfile(user.id, user.id);
                    this.getMessage(user.id);
                    this.getUserDropDown(user.id);
                    this.fetchUser(user.id);
                    this.getFollowerList(user.id);
                    this.getFollowingList(user.id);
                    this.getBids(user.id);
                    this.getPostOfBids(user.id);
                    this.setUser(response.data);
                    this.setUserCheckIn("already_logged_in");


                    this.getUserDropDown(user.id)


                }
                return res;
            })
        } catch (error) {
            //console.log("error at sign up", error.response)
        }
    }
    render() {

        return (
            <DataContext.Provider
                value={{
                    data: this.state,
                    signInUser: this.signInUser,
                    signUpUser: this.signUpUser,
                    viewPost: this.viewPost,
                    viewProfile: this.viewProfile,
                    createPostCamelClub: this.createPostCamelClub,
                    createPostTreatingCamels: this.createPostTreatingCamels,
                    createPostMissingingCamels: this.createPostMissingingCamels,
                    createPostSellingCamel: this.createPostSellingCamel,
                    createPostCamelEquipment: this.createPostCamelEquipment,
                    createPostCamelFood: this.createPostCamelFood,
                    createPostBeautyCompetition: this.createPostBeautyCompetition,
                    getNewslist: this.getNewsList,
                    createPostCamelFemale: this.createPostCamelFemale,
                    createPostLiveMarketing: this.createPostLiveMarketing,
                    submitSurvey: this.submitSurvey,
                    createPostMovingCamel: this.createPostMovingCamel,
                    getCommentsOnPost: this.getCommentsOnPost,
                    sendMessage: this.sendMessage,
                    updateProfile: this.updateProfile,
                    followRequest: this.followRequest,
                    addnewCommentNews: this.addnewCommentNews,
                    deletePost: this.deletePost,
                    placeBid: this.placeBid,
                    getCompetitionDetails: this.getCompetitionDetails,
                    checkBid: this.checkBid,
                    bidPosts: this.bidPosts,
                    createPostCamelClubb: this.createPostCamelClubb,
                }}
            >
                {this.props.children}
            </DataContext.Provider>
        );
    }
}

export const getCommentsOnPost = async (post_id) => {

    let response = null;
    try {

        //console.log("post_id at Data context", post_id)

        const formData = new FormData();
        formData.append("post_id", post_id);

        return await camelapp.post("/get/comment",
            {
                post_id: post_id,
            }
        ).then((res) => {

            //console.log("response", res.data);


            response = res.data;

            //console.log("res", response)
            return response;

        })
    } catch (error) {

        //console.log("error comments list", error.response)

    }
};


export const getCamelMoving = async () => {

    let response = null;
    try {

        //console.log("post_id at Data context", post_id)

        const formData = new FormData();
        formData.append("post_id", post_id);

        return await camelapp.post("/get/comment",
            {
                post_id: post_id,
            }
        ).then((res) => {

            //console.log("response", res.data);


            response = res.data;

            //console.log("res", response)
            return response;

        })
    } catch (error) {

        //console.log("error comments list", error.response)

    }
};


export const getSelectedSurvey = async (surveyId) => {

    try {
        let response = null;

        await camelapp.post("/get/surveyid",
            {
                id: id,
            }
        ).then((res) => {

            //console.log("response", res.news);


            response = res.news;

            //console.log("res", response)
            return response;

        })
    } catch (error) {

        //console.log("error comments list", error)

    }
};


export const likePost = async (user_id, post_id) => {

    let res = null;
    try {


        return await camelapp.post("/add/like",
            {
                user_id: user_id,
                post_id: post_id,
                type: "abc",
            }
        ).then((response) => {
            //console.log("response", response.data);
            res = response.data;
            return res;
        })
    } catch (error) {
        //console.log("error at like api", error.response)

    }
}

export const viewProfile = async (user_id, current_user_id) => {

    try {

        return await camelapp.post("/profile",
            {
                user_id: user_id,
                current_user_id: current_user_id
            }
        ).then((response) => {

            this.setState({ profile: response.data })
            let tempPost = response.data.posts.length;
            // //console.log("length of post array", tempPost)
            let array = [];
            for (let i = 0; i < tempPost; i++) {
                array.push(response.data.posts[i].post)
            }

            //console.log("array of user posts", array)
            this.setState(
                { userPosts: array }
            )

            //console.log("array of user posts from state", this.state.userPosts)


        })
    } catch (error) {

    }
};

export const likeComment = async (user_id, comment_id) => {

    let res = null;
    try {


        return await camelapp.post("/comment/like",
            {
                comment_id: comment_id,
                user_id: user_id,

            }
        ).then((response) => {
            //console.log("response", response.data);
            res = response.data;
            return res;
        })
    } catch (error) {
        //console.log("error at like api", error.response)

    }
}

export const commentReply = async (user_id, comment_id, reply) => {

    let res = null;
    try {


        return await camelapp.post("/add/reply",
            {
                user_id: user_id,
                comment_id: comment_id,
                reply: reply

            }
        ).then((response) => {
            //console.log("response", response.data);
            res = response.data;
            return res;
        })
    } catch (error) {
        //console.log("error at like api", error.response)

    }
}

export const addnewComment = async (user_id, post_id, comment) => {

    let res = null;
    try {


        return await camelapp.post("/add/comment",
            {
                user_id: user_id,
                post_id: post_id,
                comment: comment

            }
        ).then((response) => {
            //console.log("response", response.data);
            res = response.data;
            return res;
        })
    } catch (error) {
        //console.log("error at like api", error.response)

    }
}



export const getChatMessages = async (sender_id, reciever_id) => {

    let res = null;
    try {


        return await camelapp.get("/getmsgchat/" + sender_id + '/' + reciever_id).then((response) => {
            //console.log("response getChatMessages", response.data);
            res = response.data;
            return res;
        })
    } catch (error) {
        //console.log("error at getChatMessages api", error.response)

    }
}
export const followApi = async (user_id, follower_id) => {

    try {

        await camelapp.post("/follow",
            {
                user_id,
                follower_id
            }
        ).then((response) => {
            //console.log(response, 'send message response')
            res = response.data;
            return res;
        })
    }
    catch (error) {
        //console.log(error.res, 'Error of send message API')
    }

}

export const userProfile = async (user_id) => {

    let res = null;
    try {

        return await camelapp.post("/userprofile",
            {
                user_id,
            }
        ).then((response) => {
            // //console.log('userProfile', response)
            res = response.data;
            return res;
        })
    }
    catch (error) {
        //console.log('Error of userProfile API', error.res)
    }

}
export const getCompetitionDetails = async (competition_id) => {

    let response = null;
    try {

        // //console.log("post_id at Data context", post_id)

        return await camelapp.post("get/competition_details",
            {
                competition_id: competition_id
            }
        ).then((res) => {

            //console.log("response at comepetition details", res.data);


            response = res.data;

            //console.log("res", response)
            return response;

        })
    } catch (error) {

        //console.log("error at competition details", error.response)

    }
};

export const addRating = async (rating, news_id) => {

    let res = null;
    try {

        return await camelapp.post("/add/rating",
            {
                rating: rating,
                news_id: news_id,
            }
        ).then((response) => {
            //console.log('Add Rating API', response)
            res = response.data;
            return res;
        })
    }
    catch (error) {
        //console.log(error.response, 'Error of add Rating API')
    }

}

export const deletePost = async (post_id) => {
    let res = null;

    try {

        return await camelapp.post("delete/post",
            {
                post_id: post_id
            }
        ).then((response) => {



            //console.log("---- delete post", response)
            res = response.data;
            return res;

        })
    } catch (error) {
        //console.log("Error at delete Post---", error)
    }
};
export const competitionWinner = async (competition_id) => {

    let response = null;
    try {

        return await camelapp.post("/competition_winner",
            {
                competition_id: competition_id
            }
        ).then((res) => {

            response = res.data;
            return response;

        })
    } catch (error) {

        //console.log("error at competition Winner", error.response)

    }
};
export const sharePost = async (user_id, post_id) => {

    let response = null;
    try {


        //console.log("user_id", user_id)
        //console.log("post_id", post_id)

        return await camelapp.post("/add/sharess",
            {
                user_id: user_id,
                post_id: post_id
            }
        ).then((res) => {


            //console.log("response at share api", res)
            response = res.data;
            return response;

        })
    } catch (error) {

        //console.log("error at share api", error.response)

    }
};
export const withdrawBid = async (bid_id) => {

    let response = null;
    try {
        // "http://www.tasdeertech.com/api/a2z110/withdrawBids/73 "

        return await camelapp.get("withdrawBids/" + bid_id).then((res) => {

            //console.log("response at withdraw bid")
            response = res.data;
            return response;

        })
    } catch (error) {

        //console.log("error at withdraw bid", error.response)

    }
};

export const getBidsOnPost = async (post_id) => {

    try {


        return await camelapp.get("/getBidsByPostId/" + post_id).then((response) => {

            // this.setState({ bidsOnPost: response.data })


            //console.log("response from get post bids", response.data)

            return response.data


        })
    } catch (error) {
        //console.log("error at get bids on posts  bid", error.response)


    }
}