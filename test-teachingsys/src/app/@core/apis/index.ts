export const APIs = {
    learningActivity: {
        base: '/app/learning-activity',
        assign: '/app/learning-activity/assign',
        question: '/app/learning-activity/question',
        saveQuestion: '/app/learning-activity/question-bank',
        view_details: '/app/question-bank-learning-activity/',
        delete: '/app/learning-activity/delete'
    },
    questionBank: {
        questionBankList: '/app/question-bank',
        taskList: '/app/question-bank-task',
        learningActivity: '/app/question-bank-learning-activity',
    },
    assignment: {
        base: '/app/assignment',
        teacher: '/app/assignment/for-teacher'
    },
    task: {
        base: '/app/task',
    },
    auth: {
        login: '/app/authenticate/login',
        logout: '/app/authenticate/logout',
    },
    userManagement: {
        base: '/app/user-profile',
        students: "/app/user-profile?role=student",
        teachers: "/app/user-profile?role=teacher",
        admin_users: "/app/user-profile?role=admin",
    },
    testReport: {
        base: '/app/report',
        classReport: '/app/report/class-report'
    },
    classManagement: {
        class: '/app/class',
        students: '/app/student',
        studentByClass: '/app/student/by-class-id',
        studentByGroup: '/app/student/by-group-id',
        group: '/app/group',
        removeStudent: '/app/class/delete-student'
    },
    studentWorkpage: {
        base: '/app/assignment',
        workpage: '/app/assignment/for-student',
        workpageSubmitPending: '/app/assignment/student-submit-to-pending-for-teacher-review',
        workpageSubmitCompleted: '/app/assignment/student-submit-to-completed',
        selfEvaluation: '/app/assignment/student-self-evaluate',
        giveFeedback: '/app/assignment/student-feedback'
    }
};
