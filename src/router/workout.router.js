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
            },
            {
                path:'add-exercise',
                name:'add-exercise',
                component: () => import('@/views/workout/create/AddExercise.vue'),
            },
            {
                path:'draft-summary',
                name:'draft-summary',
                component: () => import('@/views/workout/create/DraftSummary.vue'),
            }

        ]
    }
];

export default workoutRouter;