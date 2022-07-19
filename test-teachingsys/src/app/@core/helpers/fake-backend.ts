import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, dematerialize, materialize, mergeMap, Observable, of, throwError } from "rxjs";
import { Account } from '@app/@core/models/account';
import { Role } from "@app/@core/models/role";
import { User } from "@app/@core/models/user";
import { TestReport } from "../models/test-report";

const accounts: Account[] = [
  { id: "64a9f9c4-c6e5-d964-2b88-3a04122987a5", userName: "admin@localhost", password: 'Admin!123', email: "admin@abp.io", roles: [Role.Admin], isVerified: false, accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFicC5pbyIsIm5hbWUiOiJhZG1pbiIsInN1YiI6IjY0YTlmOWM0LWM2ZTUtZDk2NC0yYjg4LTNhMDQxMjI5ODdhNSIsImV4cCI6MTY1NDAwMDI2OCwiaXNzIjoiQ29yZUlkZW50aXR5IiwiYXVkIjoiQ29yZUlkZW50aXR5VXNlciJ9.0an3iy98wK3F8zKgPPgoj6fiVcWXQnFZ79OmNkw3OXU", refreshToken: "27626B74945E2642989A76A790D664EBF1C48225E29CE453B68FC43B014FCF3593D3F46C69B67D46" },
  { id: "64a9f9c4-c6e5-d964-2b88-3a04122987a5", userName: "teacher@localhost", password: 'Admin!123', email: "admin@abp.io", roles: [Role.Teacher], isVerified: false, accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFicC5pbyIsIm5hbWUiOiJhZG1pbiIsInN1YiI6IjY0YTlmOWM0LWM2ZTUtZDk2NC0yYjg4LTNhMDQxMjI5ODdhNSIsImV4cCI6MTY1NDAwMDI2OCwiaXNzIjoiQ29yZUlkZW50aXR5IiwiYXVkIjoiQ29yZUlkZW50aXR5VXNlciJ9.0an3iy98wK3F8zKgPPgoj6fiVcWXQnFZ79OmNkw3OXU", refreshToken: "27626B74945E2642989A76A790D664EBF1C48225E29CE453B68FC43B014FCF3593D3F46C69B67D46" },
  { id: "64a9f9c4-c6e5-d964-2b88-3a04122987a5", userName: "student@localhost", password: 'Admin!123', email: "admin@abp.io", roles: [Role.Student], isVerified: false, accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFicC5pbyIsIm5hbWUiOiJhZG1pbiIsInN1YiI6IjY0YTlmOWM0LWM2ZTUtZDk2NC0yYjg4LTNhMDQxMjI5ODdhNSIsImV4cCI6MTY1NDAwMDI2OCwiaXNzIjoiQ29yZUlkZW50aXR5IiwiYXVkIjoiQ29yZUlkZW50aXR5VXNlciJ9.0an3iy98wK3F8zKgPPgoj6fiVcWXQnFZ79OmNkw3OXU", refreshToken: "27626B74945E2642989A76A790D664EBF1C48225E29CE453B68FC43B014FCF3593D3F46C69B67D46" }
];

// const students: User[] = [
//   { id: '219171501', userNameChi: '宁庭睿', userNameEng: 'Ning Ting Rui', email: '13795486216@163.com', phoneNumber: '012345678', title: Role.Student },
//   { id: '219171502', userNameChi: '宁庭睿', userNameEng: 'Xi Yu Lin', email: '2432545576@qq.com', phoneNumber: '054234567', title: Role.Student },
//   { id: '219171503', userNameChi: '宁庭睿', userNameEng: 'Li Lin Peng ', email: 'fsaaashe@163.com', phoneNumber: '012345678', title: Role.Student },
//   { id: '219171504', userNameChi: '宁庭睿', userNameEng: 'Wu Jun Jun', email: 'sksdbcdub@gmail.com', phoneNumber: '012345678', title: Role.Student },
// ]

// const teachers: User[] = [
//   { id: '219171501', userNameChi: '宁庭睿', userNameEng: 'Ning Ting Rui', email: '13795486216@163.com', phoneNumber: '012345678', title: Role.Teacher },
//   { id: '219171502', userNameChi: '宁庭睿', userNameEng: 'Xi Yu Lin', email: '2432545576@qq.com', phoneNumber: '054234567', title: Role.Teacher },
//   { id: '219171503', userNameChi: '宁庭睿', userNameEng: 'Li Lin Peng ', email: 'fsaaashe@163.com', phoneNumber: '012345678', title: Role.Teacher },
//   { id: '219171504', userNameChi: '宁庭睿', userNameEng: 'Wu Jun Jun', email: 'sksdbcdub@gmail.com', phoneNumber: '012345678', title: Role.Teacher },
// ]

// const admins: User[] = [
//   { id: '219171501', userNameChi: '宁庭睿', userNameEng: 'Ning Ting Rui', email: '13795486216@163.com', phoneNumber: '012345678', title: Role.Admin },
//   { id: '219171502', userNameChi: '宁庭睿', userNameEng: 'Xi Yu Lin', email: '2432545576@qq.com', phoneNumber: '054234567', title: Role.Admin },
//   { id: '219171503', userNameChi: '宁庭睿', userNameEng: 'Li Lin Peng ', email: 'fsaaashe@163.com', phoneNumber: '012345678', title: Role.Admin },
//   { id: '219171504', userNameChi: '宁庭睿', userNameEng: 'Wu Jun Jun', email: 'sksdbcdub@gmail.com', phoneNumber: '012345678', title: Role.Admin },
// ]

const tasks: TestReport[] = [
  {
    "taskName": "Industrial Robot practice trainning worksattion - ...",
    "taskUniqId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "learningActivityReports": [
      {
        "learningActivityUniqId": "act11111-5717-4562-b3fc-2c963f66afa6",
        "learningActivityTitle": "Create a robot",
        "learningActivityDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bland...",
        "dueDate": "2022-04-16T08:32:25.251Z",
        "numberOfSubmission": 100,
        "totalSubmission": 100
      },
      {
        "learningActivityUniqId": "act11112-5717-4562-b3fc-2c963f66afa6",
        "learningActivityTitle": "Create a robot",
        "learningActivityDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bland...",
        "dueDate": "2022-05-26T08:32:25.251Z",
        "numberOfSubmission": 22,
        "totalSubmission": 100
      },
      {
        "learningActivityUniqId": "act11113-5717-4562-b3fc-2c963f66afa6",
        "learningActivityTitle": "Create a robot",
        "learningActivityDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bland...",
        "dueDate": "2022-06-05T08:32:25.251Z",
        "numberOfSubmission": 33,
        "totalSubmission": 100
      }
    ]
  },
  {
    "taskName": "Industrial Robot practice trainning worksattion - ...",
    "taskUniqId": "3fa85f64-5717-4562-b3fc-2c963f66afbb",
    "learningActivityReports": [
      {
        "learningActivityUniqId": "act11114-5717-4562-b3fc-2c963f66afa6",
        "learningActivityTitle": "Create a robot",
        "learningActivityDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bland...",
        "dueDate": "2022-06-05T08:32:25.251Z",
        "numberOfSubmission": 44,
        "totalSubmission": 100
      }
    ]
  },
  {
    "taskName": "Industrial Robot practice trainning worksattion - ...",
    "taskUniqId": "3fa85f64-5717-4562-b3fc-2c963f66afcc",
    "learningActivityReports": []
  }
]

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = req;

    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getAccounts();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getAccountById();
        // case url.endsWith('/user-management/students') && method === 'GET':
        //   return getStudents();
        // case url.endsWith('/user-management/teachers') && method === 'GET':
        //   return getTeachers();
        // case url.endsWith('/user-management/admins') && method === 'GET':
        //   return getAdmins();
        case url.endsWith('/user-management') && method === 'POST':
          return createUser(body);
        case url.match(/\/user-management\/\d+$/) && method === 'PUT':
          return updateUser(body);
        case url.match(/\/user-management\/\d+$/) && method === 'DELETE':
          return deleteUser(url.split('/').pop());
        case url.endsWith('/fake-test-report/tasks') && method === 'GET':
          return getTasks();
        case url.match(/\/fake-test-report\/tasks\/[A-Za-z0-9_-]*$/) && method === 'GET':
          return getActivityDetails();
        default:
          // pass through any requests not handled above
          return next.handle(req);
      }
    }

    // route functions

    function authenticate() {
      const { userName, password } = body;
      const user = accounts.find(x => x.userName === userName && x.password === password);
      if (!user) return error('Username or password is incorrect');
      return ok({ data: { ...user } })
    }

    function createUser(data) {
      if (!isLoggedIn()) return unauthorized();
      return ok(data);
    }

    function updateUser(data) {
      if (!isLoggedIn()) return unauthorized();
      return ok(data);
    }

    function deleteUser(id) {
      if (!isLoggedIn()) return unauthorized();
      return ok(id);
    }

    // function getStudents() {
    //   if (!isLoggedIn()) return unauthorized();
    //   const rs = { totalCount: 4, data: students }
    //   return ok(rs);
    // }
    // function getTeachers() {
    //   if (!isLoggedIn()) return unauthorized();
    //   const rs = { totalCount: 4, data: teachers }
    //   return ok(rs);
    // }
    // function getAdmins() {
    //   if (!isLoggedIn()) return unauthorized();
    //   const rs = { totalCount: 4, data: admins }
    //   return ok(rs);
    // }

    function getAccounts() {
      if (!isLoggedIn()) return unauthorized();
      return ok(accounts);
    }

    function getAccountById() {
      if (!isLoggedIn()) return unauthorized();

      // only admins can access other user records
      if (!isAdmin()) return unauthorized();

      const user = accounts.find(x => x.accessToken.includes(headers.get('Authorization')));
      return ok(user);
    }

    function getTasks() {
      if (!isLoggedIn()) return unauthorized();
      const rs = { totalCount: 2, data: tasks }
      return ok(rs);
    }

    function getActivityDetails() {
      if (!isLoggedIn()) return unauthorized();
      return ok(tasks[0]);
    }

    // helper functions

    function ok(body) {
      return of(new HttpResponse({ status: 200, body }))
        .pipe(delay(500)); // delay observable to simulate server api call
    }

    function unauthorized() {
      return throwError(() => { return { status: 401, error: { message: 'unauthorized' } } })
        .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function error(message) {
      return throwError(() => { return { status: 400, error: { message } } })
        .pipe(materialize(), delay(500), dematerialize());
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer ');
    }

    function isAdmin() {
      return isLoggedIn() && currentUser().roles.includes(Role.Admin);
    }

    function currentUser() {
      if (!isLoggedIn()) return null;
      return accounts.find(x => x.accessToken.includes(headers.get('Authorization')));
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
