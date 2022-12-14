import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/signup',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Signup.vue') }],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
  },
  {
    path: '/password-reset',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PasswordReset.vue') },
    ],
  },
  {
    path: '/password-update',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PasswordUpdate.vue') },
    ],
  },
  {
    path: '/create-edit-quiz',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/CreateEditQuiz.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/create-edit-quiz/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/CreateEditQuiz.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/my-quizzes',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MyQuizzes.vue') }],
  },
  {
    path: '/my-quizzes/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MyQuiz.vue'), props: true },
    ],
  },
  {
    path: '/my-quizzes/:quizId/create-edit-question',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/CreateEditQuestion.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/my-quizzes/:quizId/demo-quiz',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/DemoQuiz.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/my-quizzes/:quizId/create-edit-question/:questionId',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/CreateEditQuestion.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
