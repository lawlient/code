# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

cmake_minimum_required(VERSION 3.12.1)

project(mysql_demo C CXX)
set(exe "mysql_demo")

set(CMAKE_PREFIX_PATH ${OUTPUT_PATH})
set(install_prefix "/data/services/mysql_demo/bin")
message(STATUS "Install Prefix: " ${install_prefix})

set(COMMON ${CMAKE_CURRENT_LIST_DIR}/../common)
include(${COMMON}/common.cmake)


#include PROTO_HEADER
include_directories(${CMAKE_CURRENT_BINARY_DIR})

add_common_source(COMMON_SRCS COMMON_LIBS MYSQL)
add_library(commonlibs ${COMMON_SRCS})
target_link_libraries(commonlibs ${COMMON_LIBS})

add_executable(${exe} client.cpp)

target_link_libraries(${exe} commonlibs ${BRPC_LIB} ${DYNAMIC_LIB})

install(TARGETS ${exe} RUNTIME DESTINATION ${install_prefix}/)