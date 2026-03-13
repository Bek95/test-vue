const userRouter = [
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/Users/Index.vue'),
    },
    {
        path: '/users/:id',
        name: 'user-details',
        component: () => import('@/views/Users/Details.vue')
    }
]

export default userRouter