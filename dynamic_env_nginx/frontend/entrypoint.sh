#!/bin/sh
err() {
    echo $* >&2
}

usage() {
    err "$(basename $0): [dev|prod]"
}

run_dev(){
    yarn dev
}

run_prod(){
    yarn build && yarn start
}

execute() {
    local task=${1}
    case ${task} in
        dev)
            run_dev
            ;;
        prod)
            run_prod
            ;;
        *)
            err "Invalid task: ${task}"
            usage
            exit 1
            ;;
    esac
}

main() {
    [ $# -ne 1 ] && { usage; exit 1; }
    local task=${1}
    execute ${task}
}

main $@
