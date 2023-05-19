#!/bin/sh
err() {
    echo $* >&2
}

usage() {
    err "$(basename $0): [dev|prod|builddev|buildprod]"
}

run_dev(){
    yarn develop
}

run_prod(){
    yarn start
}

run_build_dev(){
    yarn build && yarn develop
}

run_build_prod(){
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
        builddev)
            run_build_dev
            ;;
        buildprod)
            run_build_prod
            ;;
        *)
            err "Invalid task: ${task}"
            usage
            exit 1
            ;;
    esac
}

main() {
    [ $# -lt 1 ] && { usage; exit 1; }
    local task=${1}
    execute ${task}
}

main $@
