import { Role } from "@app/@core/models/role";

export const FIXED_MENU_CONFIG = {
    workPage: {
        title: 'work_page',
        icon: 'appstore',
        items: [
            {
                order: 1,
                title: 'question_bank',
                path: '/question-bank',
                icon: 'quiz'
            },
            {
                order: 2,
                title: 'my_learning_activity',
                path: '/learning-activity',
                icon: 'task'
            },
            {
                order: 3,
                title: 'testrp',
                path: '/test-report',
                icon: 'assessment'
            }
        ]
    },
    submission: {
        title: 'submission',
        icon: 'apartment',
        items: [
            {
                order: 1,
                title: 'pending',
                path: '/submission/pending',
                icon: 'pending_actions'
            },
            {
                order: 2,
                title: 'completed',
                path: '/submission/completed',
                icon: 'fact_check'
            },
            {
                order: 3,
                title: 'feedback',
                path: '/submission/feedback',
                icon: 'assessment'
            }
        ]
    },
    management: {
        title: 'management',
        icon: 'setting',
        items: [
            {
                order: 1,
                title: 'class',
                icon: 'switch_account',
                path: '/class'
            }
        ]
    },
  admin: {
    title: 'management',
    icon: 'setting',
    items: [
      {
        order: 1,
        title: 'user_management',
        path: '/user-management',
        icon: 'person'
      },
      {
        order: 2,
        title: 'class_management',
        path: '/class-management',
        icon: 'switch_account'
      }
    ]
  },
  studentWorkpage: [
    {
      order: 1,
      title: 'workpage',
      path: '/work-page',
      icon: 'task'
    },
    {
      order: 2,
      title: 'grade',
      path: '/grade',
      icon: 'fact_check'
    }
  ]
}

export enum DATATABLE_ACTIONS {
  DELETE = 0,
  EDIT = 1,
  ADD_TO_QUESTION_BANK = 23,
  ASSIGN = 4,
}

export const INTERPRETATION = [
  'interpretation_1',
  'interpretation_2',
  'interpretation_3',
  'interpretation_4',
  'interpretation_5',
  'interpretation_6',
]

export const ACCEPTED_FILETYPE_UPLOAD = 'image/png,image/jpeg,image/jpg,video/mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf';

export const NULL_UUID = '00000000-0000-0000-0000-000000000000';

export const USER_ROLES = [Role.Admin, Role.Student, Role.Teacher]

export enum STUDENT_STT {
    NOT_START = 'Not start',
    STARTED = 'Started',
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    ACTIVITY_FEEDBACK = 'Activity Feedback',
    NOT_ATTEMPT = 'Not Attempt'
}

export enum ANSWERS {
    NO_ANSWER_YET = 'No answer yet'
}

export const DATETIME_FORMATS = {
  MOMENT_FORMAT_YYYY_MM_DD_d: 'YYYY-MM-DD',
  MOMENT_FORMAT_YYYY_MM_DD_s: 'YYYY/MM/DD',
  DATETIME_FORMAT_YYYY_MM_DD_d: 'YYYY-MM-dd',
}

export enum WORKPAGE_STT {
  NOT_START = 'not start',
  STARTED = 'started',
  PENDING = 'pending',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
  TEACHER_EVALUATED = 'teacher evaluated',
  ACTIVITY_FEEDBACK = 'activity feedback',
  PENDING_FOR_REVIEW = 'pending for review',
  SELF_EVALUATED = 'self evaluated',
}

export enum WORKPAGE_ACTION {
  STUDENT_START = 'student start',
  TEACHER_GIVE_REVIEW = 'teacher give review',
  STUDENT_VIEW_FEEDBACK = 'student view feedback',
  TEACHER_EVALUATION = 'teacher evaluation',
  STUDENT_EVALUATION = 'student evaluation',
  STUDENT_GIVE_FEEDBACK = 'student give feedback',
}

export const WORKPAGE_ACTION_BTNS = [
  { action: WORKPAGE_ACTION.STUDENT_START, btnText: 'start', disabled: false },
  { action: WORKPAGE_ACTION.TEACHER_GIVE_REVIEW, btnText: 'view_feedback', disabled: true },
  { action: WORKPAGE_ACTION.STUDENT_VIEW_FEEDBACK, btnText: 'view_feedback', disabled: false },
  { action: WORKPAGE_ACTION.TEACHER_EVALUATION, btnText: 'self_evaluation', disabled: true },
  { action: WORKPAGE_ACTION.STUDENT_EVALUATION, btnText: 'self_evaluation', disabled: false },
  { action: WORKPAGE_ACTION.STUDENT_GIVE_FEEDBACK, btnText: 'give_feedback', disabled: false },
]

export enum QUESTION_TYPE {
  MULTIPLE_CHOICE = "MultipleChoice",
  ESSAY = "Essay",
  FILL_IN = "FillIn",
  WORK_PLAN_TABLE = "WorkPlanTable",
  VISUAL_INSPEC_TABLE = "VisualInspectionTable",
}

export const DROPDOWN_STEPS = [
  'check_training_platform',
  'choose_right_tool',
  'install_handling_tool',
  'create_new_routine',
  'to_mechanical_zero',
  'to_work_start_point',
  'complete_trajectory_motion',
  'to_safe_location'
]

export const DROPDOWN_TOOLS = [
  'teach_pendant',
  'workstation',
  'material',
  'computer',
  'pen',
  'paper',
  'screwdriver',
  'allen_wrench',
  'tape_measure',
  'wire_stripper',
  'needle_nose_pliers',
  'vise',
  'crimping_pliers'
]

export enum SELF_ASSESSMENT_TYPE {
  VISUAL_INSPECTION = "Visual Inspection",
  FUNCTIONAL_CHECK = "Functional Check"
}

export const COLOR_CLASS = [
    // 'magenta',
    // 'red',
    // 'volcano',
    // 'orange',
    // 'gold',
    // 'lime',
    // 'green',
    // 'cyan',
    // 'blue',
    'geekblue',
    // 'purple'
]
