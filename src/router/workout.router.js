const workoutRouter = [
    {
        path: '/workout',
        component: () => import('@/views/WorkoutLayout.vue'),
        children: [
            {
                path:'list',
                name:'workout-list',
                component: () => import('@/views/workout/list/List.vue'),
            },
            {
                path:'create',
                name:'workout-create',
                component: () => import('@/views/workout/create/Create.vue'),
            },
            {
                path:'training-plan-create',
                name:'training-plan-create',
                component: () => import('@/views/workout/create/TrainingPlan.vue'),
            }

        ]
    }
];

export default workoutRouter;