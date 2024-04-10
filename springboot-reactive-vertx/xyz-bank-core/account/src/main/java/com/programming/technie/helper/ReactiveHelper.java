package com.programming.technie.helper;

import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.converters.multi.MultiReactorConverters;
import io.smallrye.mutiny.converters.uni.UniReactorConverters;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

public class ReactiveHelper {

    public static <T> Mono<T> convertUniToMono(Uni<T> uni) {
        return uni.convert().with(UniReactorConverters.toMono());
    }

    public static <T> Flux<T> convertUniToFlux(Uni<List<T>> uniList) {
        List<T> l = uniList.await().indefinitely(); // blocks & waits until `Uni` emits a value or completes
        return Flux.fromIterable(l);
    }

    public static <T> Mono<T> unverified_convertMultiToMono(Multi<T> multi) {
        return multi.convert().with(MultiReactorConverters.toMono());
    }

    public static <T> Flux<T> unverified_convertMultiToFlux(Multi<T> multi) {
        return multi.convert().with(MultiReactorConverters.toFlux());
    }
}
