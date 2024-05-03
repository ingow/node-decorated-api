export function Get(path: string) {
  return (target: any, key: string) => {
    target[key].endpoint = {
      path: path,
      method: 'get',
    };
  };
}

export function Post(path: string) {
  return (target: any, key: string) => {
    target[key].endpoint = {
      path: path,
      method: 'post',
    };
  };
}

export function Put(path: string) {
  return (target: any, key: string) => {
    target[key].endpoint = {
      path: path,
      method: 'put',
    };
  };
}

export function Delete(path: string) {
  return (target: any, key: string) => {
    target[key].endpoint = {
      path: path,
      method: 'delete',
    };
  };
}

export function Patch(path: string) {
  return (target: any, key: string) => {
    target[key].endpoint = {
      path: path,
      method: 'patch',
    };
  };
}
