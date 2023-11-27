import { createRouter, createWebHistory } from "vue-router";
import store from "../store.js";

const authorization = (to, from, next) => {
  store.dispatch("readUserStateAction");
  if (store.state.user.isSignIn) {
    next();
  } else {
    next(false);
  }
};

const isSigned = (to, from, next) => {
  store.dispatch("readUserStateAction");
  if (!store.state.user.isSignIn) {
    next();
  } else {
    next(false);
  }
};

const publicRouting = (to, from, next) => {
  store.dispatch("readUserStateAction");
  next();
};

const routes = [
  {
    path: "/",
    name: "home",
    beforeEnter: publicRouting,
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/PageHome.vue"),
  },
  {
    path: "/about",
    name: "about",
    beforeEnter: publicRouting,
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PageAbout.vue"),
  },
  {
    path: "/lecture",
    name: "lecture",
    beforeEnter: publicRouting,
    component: () =>
      import(/* webpackChunkName: "lecture" */ "../views/PageLecture.vue"),
    props: true,
  },
  {
    path: "/lecture/:id",
    name: "lecture_post",
    beforeEnter: publicRouting,
    component: () =>
      import(
        /* webpackChunkName: "lecture_post" */ "../views/subViews/PostLecture.vue"
      ),
  },
  {
    path: "/lecture/write",
    name: "lecture_write",
    beforeEnter: authorization,
    component: () =>
      import(
        /* webpackChunkName: "lecture_write" */ "../views/subViews/WriteLecture.vue"
      ),
  },
  {
    path: "/lecture/:id/edit",
    name: "lecture_edit",
    beforeEnter: authorization,
    component: () =>
      import(
        /* webpackChunkName: "lecture_edit" */ "../views/subViews/WriteLecture.vue"
      ),
  },
  {
    path: "/channel",
    name: "channel",
    beforeEnter: publicRouting,
    component: () =>
      import(/* webpackChunkName: "channel" */ "../views/PageChannel.vue"),
    props: true,
  },
  {
    path: "/channel/:id",
    name: "channel_post",
    beforeEnter: publicRouting,
    component: () =>
      import(
        /* webpackChunkName: "channel_post" */ "../views/subViews/PostChannel.vue"
      ),
  },
  {
    path: "/channel/write",
    name: "channel_write",
    beforeEnter: authorization,
    component: () =>
      import(
        /* webpackChunkName: "channel_write" */ "../views/subViews/WriteChannel.vue"
      ),
  },
  {
    path: "/channel/:id/edit",
    name: "channel_edit",
    beforeEnter: authorization,
    component: () =>
      import(
        /* webpackChunkName: "channel_edit" */ "../views/subViews/WriteChannel.vue"
      ),
  },
  {
    path: "/devQnA",
    name: "devQnA",
    beforeEnter: publicRouting,
    component: () =>
      import(/* webpackChunkName: "devQnA" */ "../views/PageQnA.vue"),
    props: true,
  },
  {
    path: "/devQnA/:id",
    name: "devQnA_post",
    beforeEnter: publicRouting,
    component: () =>
      import(
        /* webpackChunkName: "devQnA_post" */ "../views/subViews/PostQnA.vue"
      ),
  },
  {
    path: "/devQnA/write",
    name: "devQnA_write",
    beforeEnter: authorization,
    component: () =>
      import(
        /* webpackChunkName: "devQnA_write" */ "../views/subViews/WriteQnA.vue"
      ),
  },
  {
    path: "/devQnA/:id/edit",
    name: "devQnA_edit",
    beforeEnter: authorization,
    component: () =>
      import(
        /* webpackChunkName: "devQnA_edit" */ "../views/subViews/WriteQnA.vue"
      ),
  },
  {
    path: "/free",
    name: "free",
    beforeEnter: publicRouting,
    component: () =>
      import(/* webpackChunkName: "free" */ "../views/PageFree.vue"),
    props: true,
  },
  {
    path: "/free/:id",
    name: "free_post",
    beforeEnter: publicRouting,
    component: () =>
      import(
        /* webpackChunkName: "free_post" */ "../views/subViews/PostFree.vue"
      ),
  },
  {
    path: "/free/write",
    name: "free_write",
    beforeEnter: authorization,
    component: () =>
      import(
        /* webpackChunkName: "free_write" */ "../views/subViews/WriteFree.vue"
      ),
  },
  {
    path: "/free/:id/edit",
    name: "free_edit",
    beforeEnter: authorization,
    component: () =>
      import(
        /* webpackChunkName: "free_edit" */ "../views/subViews/WriteFree.vue"
      ),
  },
  {
    path: "/signUp",
    name: "signUp",
    beforeEnter: isSigned,
    component: () =>
      import(/* webpackChunkName: "signup" */ "../views/PageSignUp.vue"),
  },
  {
    path: "/find",
    name: "find",
    beforeEnter: isSigned,
    component: () =>
      import(/* webpackChunkName: "find" */ "../views/PageFindIDPW.vue"),
  },
  {
    path: "/mypage",
    name: "mypage",
    beforeEnter: authorization,
    component: () =>
      import(/* webpackChunkName: "mypage" */ "../views/MyPage.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "pagenotfound",
    beforeEnter: publicRouting,
    component: () =>
      import(/* webpackChunkName: "pagenotfound" */ "../views/PageError.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
